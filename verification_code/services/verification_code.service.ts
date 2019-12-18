"use strict";
import { Context, ServiceSchema } from "moleculer";
import { Errors } from "moleculer";
// @ts-ignore
const DbService = require("moleculer-db");
import { dbAdapter } from "../database/database";
import {
  VerificationCodeSequelizeModel,
  IVerificationCodeModel
} from "../models/verification_code";
import * as bcrypt from "bcrypt";
const uuidv4 = require("uuid/v4");

const VerificationCodeService: ServiceSchema = {
  name: "verification_code",

  /**
   * Service settings
   */
  settings: {
    idField: 'id',
    fields: [
      "id",
      "userId",
      "code",
      "verified",
      "type",
      "createdAt",
      "updatedAt"
    ]
  },
  adapter: dbAdapter,

  model: {
    name: VerificationCodeSequelizeModel.name,
    define: VerificationCodeSequelizeModel.define
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
    getCode: {
      params: {
        userId: { type: "uuid" },
        type: { type: "string", min: 2 }
      },
      async handler(
        ctx: Context<{
          userId: string;
          type: string;
        }>
      ): Promise<string> {
        let entity = <IVerificationCodeModel>{};

        const verificationCode = uuidv4();

        entity.userId = ctx.params.userId;
        entity.type = ctx.params.type;
        entity.code = await bcrypt.hash(verificationCode, 10);
        entity.verified = false;
        entity.createdAt = new Date();
        entity.updatedAt = new Date();

        // Create new verification code
        await this.adapter.insert(entity);

        return verificationCode;
      }
    },
    verifyCode: {
      params: {
        userId: { type: "uuid" },
        code: { type: "uuid" },
        type: { type: "string", min: 2 }
      },
      async handler(
        ctx: Context<{
          userId: string;
          code: string;
          type: string;
        }>
      ): Promise<boolean> {
        let codeHashLookup = await this.getCodeHashForUser(
          ctx,
          ctx.params.userId,
          ctx.params.type
        );
        
        if (codeHashLookup == null) {
          throw new Errors.MoleculerClientError(
            "Verification code not found for user and type",
            400,
            "ERR_VERIFICATION_CODE_DOES_NOT_EXSIST"
          );
        }

        const isValid = await bcrypt.compare(
          ctx.params.code,
          codeHashLookup.code
        );

        // Update verification code as verified
        await this.adapter.updateById(codeHashLookup.id, {
          $set: {
            verified: isValid,
            updatedAt: new Date()
          }
        });

        return isValid;
      }
    },
    find: {
      params: {
        limit: { type: "number" },
        offset: { type: "number", optional: true },
        sort: { type: "string", optional: true }
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
     * Get code by type and user
     *
     * @param {Context} ctx
     * @param {String} userId
     * @param {String} type
     */
    async getCodeHashForUser(
      ctx: Context,
      userId: string,
      type: string
    ): Promise<IVerificationCodeModel> {
      const emailLookup = await this.adapter.find({
        limit: 2,
        query: {
          userId,
          type,
          verified: false
        },
        sort: ['createdAt']
      });
      return emailLookup[0];
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

export = VerificationCodeService;
