"use strict";
import { Context, ServiceSchema } from "moleculer";
import { Errors } from "moleculer";
// @ts-ignore
const DbService = require("moleculer-db");
import { dbAdapter } from "../database/database";
import { UserSequelizeModel, IUserModel } from "../models/user";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

var nodeFetch = require("node-fetch");
var querystring = require("querystring");

var ketoUrl = process.env.KETO_ADMIN_URL;
var mockTlsTermination = {};

const UserService: ServiceSchema = {
  name: "user",

  /**
   * Service settings
   */
  settings: {
    fields: [
      "id",
      "username",
      "firstName",
      "lastName",
      "email",
      "password",
      "avatar",
      "socialLinks",
      "status",
      "plan",
      "verified",
      "lastLoginAt",
      "createdAt",
      "updatedAt"
    ],
    graphql: {
      type: `
					"""
					This type describes a User entity.
					"""
					type User {
							id: String!
							username: String!
							firstName: String!
							lastName: String!
							email: String!
							createdAt: Date
					}
				`,
      resolvers: {
        User: {}
      }
    }
  },
  adapter: dbAdapter,

  model: {
    name: UserSequelizeModel.name,
    define: UserSequelizeModel.define
  },
  /**
   * Service dependenciescd
   */
  dependencies: [],

  /**
   * mixin dependencies
   */
  mixins: [DbService],

  /**
   * Actions
   */
  actions: {
    /**
     * Say a 'Hello'
     *
     * @returns
     */
    hello: {
      graphql: {
        query: "hello: String"
      },
      handler: () => "Hello Moleculer"
    },

    /**
     * Welcome a username
     *
     * @param {String} name - User name
     */
    welcome: {
      params: {
        username: "string"
      },
      graphql: {
        mutation: "welcome(username: String!): String"
      },
      async handler(ctx: Context<{ username: string }>) {
        return `Welcome!, ${ctx.params.username}`;
      }
    },

    register: {
      params: {
        username: { type: "string", min: 3, optional: true },
        password: { type: "string", min: 3, optional: true },
        email: { type: "email" },
        firstName: { type: "string", min: 2 },
        lastName: { type: "string", min: 2 },
        avatar: { type: "string", optional: true }
      },
      tracing: {
        tags: {
          params: [
            'username',
            'email',
            'firstName',
            'lastName',
            'avatar'
          ],
          meta: true,
        }
      },
      graphql: {
        mutation: `register(
						username: String!,
						password: String!,
						email: String!,
						firstName: String!,
						lastName: String!,
						avatar: String,
					): User`
      },
      async handler(
        ctx: Context<{
          username: string;
          password: string;
          email: string;
          firstName: string;
          lastName: string;
          avatar: string;
        }>
      ) {
        let entity = <IUserModel>{};

        // Verify email, if found then fail outright, no need to
        // look up the username etc or assign an account
        let foundEmail = await this.getUserByEmail(ctx, ctx.params.email);
        if (foundEmail) {
          throw new Errors.MoleculerClientError(
            "Email has already been registered.",
            400,
            "ERR_EMAIL_EXISTS"
          );
        }

        if (!ctx.params.username) {
          throw new Errors.MoleculerClientError(
            "Username can't be empty.",
            400,
            "ERR_USERNAME_EMPTY"
          );
        }

        let foundUsername = await this.getUserByUsername(
          ctx,
          ctx.params.username
        );
        if (foundUsername) {
          throw new Errors.MoleculerClientError(
            "Username has already been registered.",
            400,
            "ERR_USERNAME_EXISTS"
          );
        }

        // Set basic data
        entity.email = ctx.params.email;
        entity.firstName = ctx.params.firstName;
        entity.lastName = ctx.params.lastName;
        entity.plan = "FREE";
        entity.avatar = ctx.params.avatar;
        entity.socialLinks = {};
        entity.verified = true;
        entity.status = 1;

        if (!entity.avatar) {
          // Default avatar as Gravatar
          const md5 = crypto
            .createHash("md5")
            .update(entity.email)
            .digest("hex");
          entity.avatar = `https://gravatar.com/avatar/${md5}?s=64&d=robohash`;
        }

        // Generate passwordless token or hash password
        if (ctx.params.password) {
          entity.password = await bcrypt.hash(ctx.params.password, 10);
        } else {
          throw new Errors.MoleculerClientError(
            "Password can't be empty.",
            400,
            "ERR_PASSWORD_EMPTY"
          );
        }

        entity.username = ctx.params.username;

        const hasUsers = await this.hasUsers();

        // Create new user
        const user = await this.adapter.insert(entity);

        const systemRoles = await this.getRoles(user.id)

        const role = await this.parseRole(systemRoles, 'user');
        
        await this.setRole(role.id, user.id);

        if (!hasUsers) {
          const adminRole = await this.parseRole(systemRoles, 'admin');
          await this.setRole(adminRole.id, user.id);
        }

        this.broker.broadcast("user.registered", { ...entity }, "mail");

        return user;
      }
    },

    find: {
      permissions: [
        {
          subject: "user",
          action: "read",
          flavor: "exact"
        }
      ],
      params: {
        limit: { type: "number" },
        offset: { type: "number", optional: true },
        sort: { type: "string", optional: true }
      },
      graphql: {
        query: "users(limit: Int!, offset: Int, sort: String): [User]"
      }
    },

    changePassword: {
      params: {
        id: { type: "uuid" },
        code: { type: "uuid" },
        password: { type: "string", min: 7 }
      },
      tracing: {
        tags: {
          params: [
            'id',
            'code'
          ],
          meta: true,
        }
      },
      graphql: {
        mutation: `changePassword(
						id: String!,
						code: String!
						password: String!
					): User`
      },
      async handler(
        ctx: Context<{
          id: string;
          code: string;
          password: string;
        }>
      ) {
        const isValidCodeForUser = await ctx.call(
          "verification_code.verifyCode",
          {
            code: ctx.params.code,
            userId: ctx.params.id,
            type: "PASSWORD_RESET_ACTION"
          }
        );

        if (!isValidCodeForUser) {
          throw new Errors.MoleculerClientError(
            "Password reset integrity could not be determined",
            500,
            "ERR_PASSWORD_RESET_INVALID"
          );
        } else {
          const passwordHash = await bcrypt.hash(ctx.params.password, 10);
          return await this.adapter.updateById(ctx.params.id, {
            $set: {
              password: passwordHash
            }
          });
        }
      }
    },

    validatePassword: {
      params: {
        email: { type: "email" },
        password: { type: "string", min: 7 }
      },
      async handler(
        ctx: Context<{
          email: string;
          password: string;
        }>
      ) {
        const userLookup = await this.getUserByEmail(ctx, ctx.params.email);

        if (!userLookup) {
          throw new Errors.MoleculerClientError(
            "Email does not match passowrd.",
            400,
            "ERR_USER_UNKNOWN"
          );
        }

        const isValid = await bcrypt.compare(
          ctx.params.password,
          userLookup.password
        );

        return isValid;
      }
    }
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
    /**
     * Get user by email
     *
     * @param {Context} ctx
     * @param {String} email
     */
    async hasUsers(ctx: Context, email: string) {
      const userLookup = await this.adapter.find({
        limit: 2
      });
      return userLookup.length !== 0;
    },
    
    /**
     * Parse Role from Keto
     *
     * @param {Context} ctx
     * @param {String} email
     */
    async parseRole(systemRoles: {id: string, members: string[]}[], role: string) {
      const userRole = systemRoles.find((sysRole: any) => sysRole.id.indexOf(`:${role}`) > -1)
      return userRole;
    },

    /**
     * Get user by email
     *
     * @param {Context} ctx
     * @param {String} email
     */
    async getUserByEmail(ctx: Context, email: string) {
      const emailLookup = await this.adapter.find({
        limit: 1,
        query: { email }
      });
      return emailLookup[0];
    },

    /**
     * Get user 
     *
     * @param {Context} ctx
     * @param {String} username
     */
    async getRoles(ctx: Context) {
      const url = new URL("/engines/acp/ory/exact/roles", ketoUrl);
      return nodeFetch(url.toString(), {
        method: "GET",
        headers: {
          ...mockTlsTermination
        }
      }).then(function(res: any) {
        if (res.status < 200 || res.status > 302) {
          // This will handle any errors that aren't network related (network related errors are handled automatically)
          return res.json().then(function(body: any) {
            console.error("An error occurred while making a HTTP request: ", body);
            return Promise.reject(new Error(body.error.message));
          });
        }

        return res.json();
      });
    },

    /**
     * Set role
     *
     * @param {number} roleId
     * @param {String} userId
     */
    async setRole(roleId: number, userId: String) {
      const url = new URL(`/engines/acp/ory/exact/roles/${roleId}/members`, ketoUrl);
      return nodeFetch(url.toString(), {
        method: "PUT",
        body: JSON.stringify({members: [userId]}),
        headers: {
          ...mockTlsTermination
        }
      }).then(function(res: any) {
        if (res.status < 200 || res.status > 302) {
          // This will handle any errors that aren't network related (network related errors are handled automatically)
          return res.json().then(function(body: any) {
            console.error("An error occurred while making a HTTP request: ", body);
            return Promise.reject(new Error(body.error.message));
          });
        }

        return res.json();
      });
    },
    /**
     * Get user by username
     *
     * @param {Context} ctx
     * @param {String} username
     */
    async getUserByUsername(ctx: Context, username: string) {
      const usernameLookup = await this.adapter.find({
        limit: 1,
        query: { username }
      });
      return usernameLookup[0];
    }
  },

  /**
   * Service created lifecycle event handler
   */
  created() {}

  /**
   * Service started lifecycle event handler
   */
  // async started() {

  // },

  /**
   * Service stopped lifecycle event handler
   */
  // async stopped() {

  // },
};

export = UserService;
