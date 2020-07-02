import { Errors, Context, ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
const { ApolloService } = require("moleculer-apollo-server");
const Kind = require("graphql/language").Kind;
import { hydra } from "../hydra";
import { compileFile } from "pug";
import { ValidatorResponse } from "types/validator";
var querystring = require("querystring");
const Validator = require("fastest-validator");
var nodeFetch = require("node-fetch");

//Cookie parsing imports
import { parse } from "cookie";
import Iron from "@hapi/iron";

var ketoUrl = process.env.KETO_ADMIN_URL;
var mockTlsTermination = {};
const multer = require("multer");

// TODO empty the destination to prevent memory blow up in container
const upload = multer({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "/var/tmp/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, req.file.originalname);
  },
});

const TOKEN_SECRET =
  process.env.COOKIE_SECRET ||
  "this-is-a-secret-value-with-at-least-32-characters";

const ApiService: ServiceSchema = {
  name: "api",

  mixins: [
    ApiGateway,
    ApolloService({
      // Global GraphQL typeDefs
      typeDefs: `
        scalar Date
      `,

      // Global resolvers
      resolvers: {
        Date: {
          __parseValue(value: any) {
            return new Date(value); // value from the client
          },
          __serialize(value: string) {
            return new Date(value).getTime(); // value sent to the client
          },
          __parseLiteral(ast: { value: any; kind: any }) {
            if (ast.kind === Kind.INT) return parseInt(ast.value, 10); // ast value is always in string format
            return null;
          },
        },
      },

      // API Gateway route options
      routeOptions: {
        authorization: true,
        path: "/graphql",
        cors: true,
        mappingPolicy: "restrict",
      },
      serverOptions: {
        tracing: true,
      },
    }),
  ],

  // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,
    routes: [
      {
        path: "/api",
        whitelist: ["**"],
        authorization: true,
      },
      {
        path: "/login",
        aliases: {
          "GET /"(req: any, res: any, next: any) {
            const validator = new Validator();
            let login_challenge: string = null;
            if (req.$params.login_challenge) {
              login_challenge = req.$params.login_challenge;

              hydra
                .getLoginRequest(login_challenge)
                // This will be called if the HTTP request was successful
                .then(function (response: any) {
                  // If hydra was already able to authenticate the user, skip will be true and we do not need to re-authenticate
                  // the user.
                  if (response.skip) {
                    // You can apply logic here, for example update the number of times the user logged in.
                    // ...

                    // Now it's time to grant the login request. You could also deny the request if something went terribly wrong
                    // (e.g. your arch-enemy logging in...)
                    return hydra
                      .acceptLoginRequest(login_challenge, {
                        // All we need to do is to confirm that we indeed want to log in the user.
                        subject: response.subject,
                      })
                      .then(function (response: any) {
                        // All we need to do now is to redirect the user back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to,
                        });
                        res.end();
                      });
                  }

                  // If authentication can't be skipped we MUST show the login UI.
                  req.$service.buildPageResponse(res, `login`, {
                    challenge: login_challenge,
                  });
                })
                // This will handle any error that happens when making HTTP calls to hydra
                .catch(function (error: any) {
                  next(error);
                });
            } else {
              const schema = {
                grant_type: { type: "string", empty: false },
                scope: { type: "string", empty: false },
                client_id: { type: "string", empty: false },
                redirect_uri: { type: "url" },
                response_type: { type: "string", empty: false },
                state: { type: "string", empty: false },
              };

              const validParams: ValidatorResponse = validator.validate(
                req.$params,
                schema
              );

              if (validParams !== true && typeof validParams == "object") {
                const errorMessage = validParams
                  .map((value) => {
                    return `${value.field}: ${value.message}`;
                  })
                  .join(", \r\n");

                req.$service.buildPageResponse(res, `error`, {
                  message:
                    "Can't process login request due to missing parameters.",
                  error: {
                    status: "Error",
                    stack: errorMessage,
                  },
                });
              } else {
                res.writeHead(302, {
                  Location: `https://trust.${process.env.HOST_NAME}/oauth2/auth?grant_type=${req.$params.grant_type}&scope=${req.$params.scope}&client_id=${req.$params.client_id}&redirect_uri=${req.$params.redirect_uri}&response_type=${req.$params.response_type}`,
                });
                res.end();
              }
            }
          },
          "POST /": async (req: any, res: any, next: any) => {
            // The challenge is now a hidden input field, so let's take it from the request body instead

            let body: string[] = [];
            await req
              .on("data", (chunk: string) => {
                body.push(chunk);
              })
              .on("end", async () => {
                //@ts-ignore
                let bodyString = Buffer.concat(body).toString();

                const parsedBody: {
                  challenge: string;
                  email: string;
                  password: string;
                  remember?: boolean;
                  csrf?: string;
                } = querystring.parse(bodyString);

                const isPasswordValid = await req.$ctx.broker.call(
                  "v1.user.validatePassword",
                  {
                    email: parsedBody.email,
                    password: parsedBody.password,
                  }
                );

                // Let's check if the user provided valid credentials
                if (!isPasswordValid) {
                  hydra
                    .rejectLoginRequest(parsedBody.challenge, {
                      error: "invalid_request",
                      error_description: "The user did something stupid...",
                    })
                    .then(function (response: { redirect_to: string }) {
                      // All we need to do now is to redirect the browser back to hydra!
                      res.redirect(response.redirect_to);
                    })
                    // This will handle any error that happens when making HTTP calls to hydra
                    .catch(function (error: Error) {
                      next(error);
                    });

                  // Looks like the user provided invalid credentials, let's show the ui again...
                  var fn = compileFile(`./pages/login.pug`, {});
                  const html = fn({
                    challenge: parsedBody.challenge,
                    error: "The username / password combination is not correct",
                  });
                  res.writeHead(200, {
                    "Content-Type": "text/html",
                  });
                  res.write(html);
                  res.end();
                } else {
                  // Seems like the user authenticated! Let's tell hydra...
                  hydra
                    .acceptLoginRequest(parsedBody.challenge, {
                      // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
                      subject: parsedBody.email,

                      // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
                      // set the "skip" parameter in the other route to true on subsequent requests!
                      remember: Boolean(parsedBody.remember),

                      // When the session expires, in seconds. Set this to 0 so it will never expire.
                      remember_for: 3600,

                      // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
                      // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
                      // acr: '0',
                    })
                    .then(async function (response: { redirect_to: string }) {
                      // We need to check if this route is the admin panel
                      const isAdminProtectedCallback =
                        response.redirect_to.indexOf("%2Fadmin%2F") > -1;

                      let hasAccess = true;

                      if (isAdminProtectedCallback) {
                        const getUser = await req.$ctx.call("v1.user.find", {
                          limit: 1,
                          query: { email: parsedBody.email },
                        });

                        try {
                          const url = new URL(
                            "/engines/acp/ory/exact/roles",
                            ketoUrl
                          );
                          const ketoPermissions = await nodeFetch(
                            url.toString(),
                            {
                              method: "GET",
                              headers: {
                                ...mockTlsTermination,
                              },
                            }
                          );

                          if (
                            ketoPermissions.status < 200 ||
                            ketoPermissions.status > 302
                          ) {
                            // This will handle any errors that aren't network related (network related errors are handled automatically)
                            const body = await ketoPermissions.json();
                            console.error(
                              "An error occurred while making a HTTP request: ",
                              body
                            );
                            throw Promise.reject(new Error(body.error.message));
                          }
                          const roles = await ketoPermissions.json();
                          hasAccess = roles.some(
                            (role: any) =>
                              role.id.indexOf(":admin") > -1 &&
                              role.members.some(
                                (userId: string) => userId === getUser[0].id
                              )
                          );
                        } catch (e) {
                          console.log(e);
                          throw e;
                        }
                      }
                      res.writeHead(302, {
                        Location: hasAccess
                          ? response.redirect_to
                          : `https://${process.env.HOST_NAME}`,
                      });
                      res.end();
                    })
                    // This will handle any error that happens when making HTTP calls to hydra
                    .catch(function (error: Error) {
                      next(error);
                    });
                }
              });
          },
        },
      },
      {
        path: "/link",
        aliases: {
          google: "v1.third_party_tokens.authorize",
          "google/callback": "v1.third_party_tokens.callback",
        },
        authorization: true,
      },
      {
        path: "/consent",
        aliases: {
          "GET /": (req: any, res: any, next: any) => {
            let consent_challenge: string = null;
            if (req.$params.consent_challenge) {
              consent_challenge = req.$params.consent_challenge;

              hydra
                .getConsentRequest(consent_challenge)
                // This will be called if the HTTP request was successful
                .then(function (response: any) {
                  // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
                  if (response.skip) {
                    // You can apply logic here, for example grant another scope, or do whatever...
                    // ...

                    // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
                    return hydra
                      .acceptConsentRequest(consent_challenge, {
                        // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
                        // are requested accidentally.
                        grant_scope: response.requested_scope,

                        // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
                        grant_access_token_audience:
                          response.requested_access_token_audience,

                        // The session allows us to set session data for id and access tokens
                        session: {
                          // This data will be available when introspecting the token. Try to avoid sensitive information here,
                          // unless you limit who can introspect tokens.
                          // access_token: { foo: 'bar' },
                          // This data will be available in the ID token.
                          // id_token: { baz: 'bar' },
                        },
                      })
                      .then(function (response: { redirect_to: string }) {
                        // All we need to do now is to redirect the user back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to,
                        });
                        res.end();
                      });
                  }

                  // Looks like the user provided invalid credentials, let's show the ui again...
                  req.$service.buildPageResponse(res, `consent`, {
                    challenge: consent_challenge,
                    // We have a bunch of data available from the response, check out the API docs to find what these values mean
                    // and what additional data you have available.
                    requested_scope: response.requested_scope,
                    user: response.subject,
                    client: response.client,
                  });
                })
                // This will handle any error that happens when making HTTP calls to hydra
                .catch(function (error: Error) {
                  next(error);
                });
            } else {
              res.writeHead(302, {
                Location: `https://trust.${process.env.HOST_NAME}/oauth2/auth?grant_type=${req.$params.grant_type}&scope=${req.$params.scope}&client_id=${req.$params.client_id}&redirect_uri=${req.$params.redirect_uri}&response_type=${req.$params.response_type}`,
              });
              res.end();
            }
          },
          "POST /": async (req: any, res: any, next: any) => {
            // The challenge is now a hidden input field, so let's take it from the request body instead

            let body: string[] = [];
            await req
              .on("data", (chunk: string) => {
                body.push(chunk);
              })
              .on("end", async () => {
                //@ts-ignore
                let bodyString = Buffer.concat(body).toString();

                const parsedBody: {
                  challenge: string;
                  email: string;
                  password: string;
                  remember?: boolean;
                  csrf?: string;
                  submit?: string;
                  grant_scope?: string[];
                } = querystring.parse(bodyString);

                // Let's see if the user decided to accept or reject the consent request..
                if (parsedBody.submit === "Deny access") {
                  // Looks like the consent request was denied by the user
                  return (
                    hydra
                      .rejectConsentRequest(parsedBody.challenge, {
                        error: "access_denied",
                        error_description:
                          "The resource owner denied the request",
                      })
                      .then(function (response: { redirect_to: string }) {
                        // All we need to do now is to redirect the browser back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to,
                        });
                        res.end();
                      })
                      // This will handle any error that happens when making HTTP calls to hydra
                      .catch(function (error: Error) {
                        next(error);
                      })
                  );
                }

                var grant_scope = parsedBody.grant_scope;
                if (!Array.isArray(grant_scope)) {
                  grant_scope = [grant_scope];
                }

                const userLookup = await req.$ctx.call(
                  "v1.user.find",
                  {
                    limit: 1,
                    query: { email: parsedBody.email },
                  },
                  {
                    meta: {
                      user: {},
                      roles: null,
                    },
                  }
                );

                if (userLookup == null || userLookup.length == 0) {
                  req.$service.buildPageResponse(res, `forgot_password`, {
                    error: "User with provided email could not be found",
                  });
                } else {
                  // Seems like the user authenticated! Let's tell hydra...
                  hydra
                    .getConsentRequest(parsedBody.challenge)
                    // This will be called if the HTTP request was successful
                    .then(function (response: any) {
                      return hydra
                        .acceptConsentRequest(parsedBody.challenge, {
                          // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
                          // are requested accidentally.
                          grant_scope: grant_scope,

                          // The session allows us to set session data for id and access tokens
                          session: {
                            // This data will be available when introspecting the token. Try to avoid sensitive information here,
                            // unless you limit who can introspect tokens.
                            access_token: {
                              id: userLookup[0].id,
                              firstName: userLookup[0].firstName,
                            },
                            // This data will be available in the ID token.
                            id_token: {
                              id: userLookup[0].id,
                              firstName: userLookup[0].firstName,
                            },
                          },

                          // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
                          grant_access_token_audience:
                            response.requested_access_token_audience,

                          // This tells hydra to remember this consent request and allow the same client to request the same
                          // scopes from the same user, without showing the UI, in the future.
                          remember: Boolean(parsedBody.remember),

                          // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
                          remember_for: 3600,
                        })
                        .then(function (response: { redirect_to: string }) {
                          // All we need to do now is to redirect the user back to hydra!
                          res.writeHead(302, {
                            Location: response.redirect_to,
                          });
                          res.end();
                        });
                    })
                    // This will handle any error that happens when making HTTP calls to hydra
                    .catch(function (error: Error) {
                      next(error);
                    });
                }
              });
          },
        },
      },
      {
        // The user flow looks like this...
        // 1. GET is called on /forgot_password and the user enters email
        // 2. From there they submit a POST of the email
        //  - this is then checked if valid
        // 3. If valid, a code is requested from the verification code service
        // 4. The code is then attached to a payload to the email service
        // 5. The email service emails the use a password reset email
        //  - This email has a link with the userId (as id) and the code from the verif service
        // 6. User clicks the link, GET on /forgot_password/reset is called
        //  - The user's code and id are checked via the verification_code service
        //    - if valid the user is presented with forgot_password_reset template
        //    - if invalid the user is brought back to /forgot_password
        // 7. The user provides new password and POST to /forgot_password/reset
        //  - The form this page has the code and id which was present in the link as hidden form fields
        //    this is then sent over on the password reset to double check that they are who they are
        //    and we can proceed with changing the password
        path: "/forgot_password",
        aliases: {
          "GET /"(req: any, res: any, next: any) {
            let code: string = null;
            if (req.$params.code) {
              code = req.$params.code;

              // Looks like the user provided invalid credentials, let's show the ui again...
              req.$service.buildPageResponse(res, `forgot_password`, {
                code,
              });
            } else {
              req.$service.buildPageResponse(res, `forgot_password`, {});
            }
          },
          "POST /": async (req: any, res: any, next: any) => {
            let body: string[] = [];
            const parsedBody = await req
              .on("data", (chunk: string) => {
                body.push(chunk);
              })
              .on("end", async () => {
                //@ts-ignore
                let bodyString = Buffer.concat(body).toString();

                const parsedBody: {
                  email: string;
                } = querystring.parse(bodyString);

                const userLookup = await req.$ctx.call("v1.user.find", {
                  limit: 1,
                  query: { email: parsedBody.email },
                });

                if (userLookup == null || userLookup.length == 0) {
                  req.$service.buildPageResponse(res, `forgot_password`, {
                    error: "User with provided email could not be found",
                  });
                } else {
                  const forgotPasswordCode = await req.$ctx.call(
                    "verification_code.getCode",
                    {
                      userId: userLookup[0].id,
                      type: "PASSWORD_RESET_REQUEST",
                    }
                  );

                  await req.$ctx.call("mail.send", {
                    to: userLookup[0].email,
                    template: "forgot_password",
                    data: {
                      username: userLookup[0].username,
                      userId: userLookup[0].id,
                      verifyToken: forgotPasswordCode,
                      host: process.env.HOST_NAME,
                    },
                  });

                  req.$service.buildPageResponse(res, `forgot_password`, {
                    success: "An email has been sent.",
                  });
                }
              });
          },
          "GET /reset": async (req: any, res: any, next: any) => {
            let code: string = null;
            let id: string = null;

            if (req.$params.code) {
              code = req.$params.code;
            }
            if (req.$params.id) {
              id = req.$params.id;
            }

            let params: {
              code: string;
              id: string;
              error?: string;
            } = {
              code,
              id,
            };

            try {
              const isValidCodeForUser = await req.$ctx.call(
                "verification_code.verifyCode",
                {
                  code,
                  userId: id,
                  type: "PASSWORD_RESET_REQUEST",
                }
              );

              if (!isValidCodeForUser) {
                params = {
                  ...params,
                  error: "Invalid password reset link",
                };
              } else {
                // If the password request request was valid and not used
                // then lets create one for the action
                const forgotPasswordActionCode = await req.$ctx.call(
                  "verification_code.getCode",
                  {
                    userId: id,
                    type: "PASSWORD_RESET_ACTION",
                  }
                );

                // Here we override the request code for the
                // action code
                params = {
                  ...params,
                  code: forgotPasswordActionCode,
                };
              }
            } catch (error) {
              params = {
                ...params,
                error: error.message,
              };
            }

            req.$service.buildPageResponse(
              res,
              params.error ? `forgot_password` : `forgot_password_reset`,
              params
            );
          },
          "POST /reset": async (req: any, res: any, next: any) => {
            let body: string[] = [];
            const parsedBody = await req
              .on("data", (chunk: string) => {
                body.push(chunk);
              })
              .on("end", async () => {
                //@ts-ignore
                let bodyString = Buffer.concat(body).toString();

                const parsedBody: {
                  id: string;
                  code: string;
                  password: string;
                } = querystring.parse(bodyString);

                let params: {
                  code: string;
                  id: string;
                  error?: string;
                  success?: string;
                } = {
                  code: parsedBody.code,
                  id: parsedBody.id,
                };

                try {
                  const userLookup = await req.$ctx.call(
                    "v1.user.changePassword",
                    {
                      ...parsedBody,
                    }
                  );

                  params = {
                    ...params,
                    success: `Congrats ${userLookup.firstName}, you're password reset is complete.`,
                  };
                } catch (error) {
                  params = {
                    ...params,
                    error: error.message,
                  };
                }

                req.$service.buildPageResponse(res, `forgot_password`, params);
              });
          },
        },
      },
      {
        path: "/upload",
        use: [upload.single("file")],
        // You should disable body parsers
        bodyParsers: {
          json: false,
          urlencoded: false,
        },

        aliases: {
          // File upload from HTML multipart form
          "POST /": async (req: any, res: any, next: any) => {
            res.setHeader("Content-Type", "application/json");
            if (!req.file || !req.body.entityId) {
              return res.end(
                JSON.stringify({
                  error: "file and entityId is required",
                })
              );
            }
            try {
              const result = await req.$ctx.call("v1.media.uploadMedia", {
                fileName: req.file.originalname,
                size: req.file.size,
                buffer: req.file.buffer,
                entityId: req.body.entityId,
                type: req.file.mimetype,
              });
              return res.end(JSON.stringify({ result }));
            } catch (e) {
              return res.end(
                JSON.stringify({
                  error: e,
                })
              );
            }
          },

          // File upload from AJAX or cURL
          "PUT /": "stream:file.save",

          // File upload from HTML form and overwrite busboy config
          "POST /multi": {
            type: "multipart",
            // Action level busboy config
            busboyConfig: {
              limits: { files: 3 },
            },
            action: "file.save",
          },
        },

        // Route level busboy config.
        // More info: https://github.com/mscdex/busboy#busboy-methods
        busboyConfig: {
          limits: { files: 1 },
          // Can be defined limit event handlers
          // `onPartsLimit`, `onFilesLimit` or `onFieldsLimit`
        },
        mappingPolicy: "restrict",
      },
    ],
    // Serve assets from "public" folder
    assets: {
      folder: "public",
    },
  },

  methods: {
    renderPage(name: string, params: object, options: object): string {
      var fn = compileFile(
        `${__dirname.split("services")[0]}pages/${name}.pug`,
        options
      );
      return fn(params);
    },
    buildPageResponse(res: any, page: string, payload: {}): any {
      const html = this.renderPage(page, payload, {});
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(html);
      return res.end();
    },
    async authorize(ctx: Context<{}, { user: { id?: string, name?: string, isLoggedIn: boolean }, roles: Array<string> }>, route: string, req: any, res: any) {
      this.logger.info("running authorize");
      // Read the token from header
      let auth = req.headers["authorization"] || req.headers["Authorization"];
      let authCookie = req.headers["cookie"];

      if (auth && auth.startsWith("Bearer")) {
        let token = auth.slice(7);

        const tokenIntrospection: {
          active: boolean;
          client_id: boolean;
          scope: string;
          sub: string;
          ext: {
            firstName: string;
            id: string;
          };
        } = await hydra.checkToken(token);

        // Check the token
        if (tokenIntrospection && tokenIntrospection.active) {
          // Set the authorized user entity to `ctx.meta`
          ctx.meta.user = {
            id: tokenIntrospection.ext.id,
            name: tokenIntrospection.ext.firstName,
            isLoggedIn: true,
          };
          ctx.meta.roles = tokenIntrospection.scope.split(" ");
          return ctx;
        } else {
          // Invalid token
          throw new Errors.MoleculerClientError(
            "Unauthorized: Invalid token provided",
            401,
            "ERR_UNAUTHORIZED"
          );
        }
      } else if (authCookie && authCookie.indexOf("poi_auth_token") > -1) {
        const token = parse(authCookie);
        //@ts-ignore
        const authCookieInfo: {
          authorizationKeys: {
            accessToken: string;
            refreshToken: string;
          };
        } = await Iron.unseal(
          token["poi_auth_token"],
          TOKEN_SECRET,
          Iron.defaults
        );

        // They have a cookie for the root domain but do not have and auth'ed keys yet
        // if so then let the request continue and have the permission middleware on each
        // service handle which endpoints should be public or not
        if (authCookieInfo.authorizationKeys === undefined) {
          return ctx;
        }

        const tokenIntrospection: {
          active: boolean;
          client_id: boolean;
          scope: string;
          sub: string;
          ext: {
            firstName: string;
            id: string;
          };
        } = await hydra.checkToken(
          authCookieInfo.authorizationKeys.accessToken
        );

        // Check the token
        if (tokenIntrospection && tokenIntrospection.active) {
          // Set the authorized user entity to `ctx.meta`
          ctx.meta.user = {
            id: tokenIntrospection.ext.id,
            name: tokenIntrospection.ext.firstName,
            isLoggedIn: true,
          };
          ctx.meta.roles = tokenIntrospection.scope.split(" ");
          return ctx;
        } else if (req.$route.path == "/graphql") {
          return ctx;
        } else {
          // Invalid token
          throw new Errors.MoleculerClientError(
            "Unauthorized: Invalid cookie provided",
            401,
            "ERR_UNAUTHORIZED"
          );
        }
      } else {
        // resolving as a pass through without an error
        // Permissions are checked by the user of a middleware which checks token scope.
        // If there is no token... then the call if it has zero permisions will be allowed
        // If there is a token it's permissions are checked against the Keto service
        ctx.meta.user = {
          isLoggedIn: false,
        };
        return ctx;

        // If you want you can block all graphql calls by rejecting the promise.
        // return Promise.reject(new Errors.MoleculerClientError(new Errors.MoleculerClientError(
        //   "Unauthorized: No token provided",
        //   400,
        //   "ERR_NO_TOKEN"
        // )));
      }
    },
  },
};

export = ApiService;
