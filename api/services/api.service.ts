import { Errors, ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
const { ApolloService } = require("moleculer-apollo-server");
const Kind = require("graphql/language").Kind;
import { hydra } from "../hydra";
var pug = require("pug");
var querystring = require("querystring");

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
          __serialize(value: any) {
            return value.getTime(); // value sent to the client
          },
          __parseLiteral(ast: { value: any; kind: any }) {
            if (ast.kind === Kind.INT) return parseInt(ast.value, 10); // ast value is always in string format

            return null;
          }
        }
      },

      // API Gateway route options
      routeOptions: {
        path: "/graphql",
        cors: true,
        mappingPolicy: "restrict"
      },
      serverOptions: {
        tracing: true
      }
    })
  ],

  // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,
    routes: [
      {
        path: "/api",
        whitelist: ["**"]
      },
      {
        path: "/login",
        aliases: {
          "GET /"(req: any, res: any, next: any) {
            let login_challenge: string = null;
            if (req.$params.login_challenge) {
              login_challenge = req.$params.login_challenge;

              hydra
                .getLoginRequest(login_challenge)
                // This will be called if the HTTP request was successful
                .then(function(response: any) {
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
                        subject: response.subject
                      })
                      .then(function(response: any) {
                        // All we need to do now is to redirect the user back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to
                        });
                        res.end();
                      });
                  }

                  // If authentication can't be skipped we MUST show the login UI.
                  req.$service.buildPageResponse(res, `login`, {
                    challenge: login_challenge
                  });
                })
                // This will handle any error that happens when making HTTP calls to hydra
                .catch(function(error: any) {
                  next(error);
                });
            } else {
              res.writeHead(302, {
                Location: `https://${process.env.HOST_NAME}/oauth/oauth2/auth?grant_type=client_credentials&scope=offline&client_id=catalyst_admin&redirect_uri=https://${process.env.HOST_NAME}/admin/callback&response_type=code&state=badassmofo`
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
              .on("end", () => {
                //@ts-ignore
                let bodyString = Buffer.concat(body).toString();

                const parsedBody: {
                  challenge: string;
                  email: string;
                  password: string;
                  remember?: boolean;
                  csrf?: string;
                } = querystring.parse(bodyString);

                // var challenge = body.challenge;

                // Let's check if the user provided valid credentials. Of course, you'd use a database or some third-party service
                // for this!
                if (
                  !(
                    parsedBody.email === "foo@bar.com" &&
                    parsedBody.password === "foobar"
                  )
                ) {
                  // Looks like the user provided invalid credentials, let's show the ui again...
                  var fn = pug.compileFile(`./pages/login.pug`, {});
                  const html = fn({
                    challenge: parsedBody.challenge,
                    error: "The username / password combination is not correct"
                  });
                  res.writeHead(200, {
                    "Content-Type": "text/html"
                  });
                  res.write(html);
                  res.end();
                }

                // Seems like the user authenticated! Let's tell hydra...
                hydra
                  .acceptLoginRequest(parsedBody.challenge, {
                    // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
                    subject: "foo@bar.com",

                    // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
                    // set the "skip" parameter in the other route to true on subsequent requests!
                    remember: Boolean(parsedBody.remember),

                    // When the session expires, in seconds. Set this to 0 so it will never expire.
                    remember_for: 3600

                    // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
                    // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
                    // acr: '0',
                  })
                  .then(function(response: { redirect_to: string }) {
                    // All we need to do now is to redirect the user back to hydra!

                    console.log(response.redirect_to);

                    res.writeHead(302, {
                      Location: response.redirect_to
                    });
                    res.end();
                  })
                  // This will handle any error that happens when making HTTP calls to hydra
                  .catch(function(error: Error) {
                    next(error);
                  });

                // You could also deny the login request which tells hydra that no one authenticated!
                // hydra.rejectLoginRequest(challenge, {
                //   error: 'invalid_request',
                //   error_description: 'The user did something stupid...'
                // })
                //   .then(function (response) {
                //     // All we need to do now is to redirect the browser back to hydra!
                //     res.redirect(response.redirect_to);
                //   })
                //   // This will handle any error that happens when making HTTP calls to hydra
                //   .catch(function (error) {
                //     next(error);
                //   });
              });
          }
        }
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
                .then(function(response: any) {
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
                        }
                      })
                      .then(function(response: { redirect_to: string }) {
                        // All we need to do now is to redirect the user back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to
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
                    client: response.client
                  });
                })
                // This will handle any error that happens when making HTTP calls to hydra
                .catch(function(error: Error) {
                  next(error);
                });
            } else {
              res.writeHead(302, {
                Location:
                  "https://funk.derekbarrera.com/oauth/oauth2/auth?grant_type=client_credentials&scope=offline&client_id=catalyst_admin&redirect_uri=https://funk.derekbarrera.com/admin/callback&response_type=code&state=badassmofo"
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
              .on("end", () => {
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
                          "The resource owner denied the request"
                      })
                      .then(function(response: { redirect_to: string }) {
                        // All we need to do now is to redirect the browser back to hydra!
                        res.writeHead(302, {
                          Location: response.redirect_to
                        });
                        res.end();
                      })
                      // This will handle any error that happens when making HTTP calls to hydra
                      .catch(function(error: Error) {
                        next(error);
                      })
                  );
                }

                var grant_scope = parsedBody.grant_scope;
                if (!Array.isArray(grant_scope)) {
                  grant_scope = [grant_scope];
                }

                // Seems like the user authenticated! Let's tell hydra...
                hydra
                  .getConsentRequest(parsedBody.challenge)
                  // This will be called if the HTTP request was successful
                  .then(function(response: any) {
                    return hydra
                      .acceptConsentRequest(parsedBody.challenge, {
                        // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
                        // are requested accidentally.
                        grant_scope: grant_scope,

                        // The session allows us to set session data for id and access tokens
                        session: {
                          // This data will be available when introspecting the token. Try to avoid sensitive information here,
                          // unless you limit who can introspect tokens.
                          access_token: { foo: "bar" },
                          // This data will be available in the ID token.
                          id_token: { baz: "bar" }
                        },

                        // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
                        grant_access_token_audience:
                          response.requested_access_token_audience,

                        // This tells hydra to remember this consent request and allow the same client to request the same
                        // scopes from the same user, without showing the UI, in the future.
                        remember: Boolean(parsedBody.remember),

                        // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
                        remember_for: 3600
                      })
                      .then(function(response: { redirect_to: string }) {
                        // All we need to do now is to redirect the user back to hydra!

                        console.log(`redirect_ending:`, response.redirect_to);

                        res.writeHead(302, {
                          Location: response.redirect_to
                        });
                        res.end();
                      });
                  })
                  // This will handle any error that happens when making HTTP calls to hydra
                  .catch(function(error: Error) {
                    next(error);
                  });
              });
          }
        }
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
                code
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

                const userLookup = await req.$ctx.call("user.find", {
                  limit: 1,
                  query: { email: parsedBody.email }
                });

                if (userLookup == null || userLookup.length == 0) {
                  req.$service.buildPageResponse(res, `forgot_password`, {
                    error: "User with provided email could not be found"
                  });
                } else {
                  const forgotPasswordCode = await req.$ctx.call(
                    "verification_code.getCode",
                    {
                      userId: userLookup[0].id,
                      type: "PASSWORD_RESET_REQUEST"
                    }
                  );

                  await req.$ctx.call("mail.send", {
                    to: userLookup[0].email,
                    template: "forgot_password",
                    data: {
                      username: userLookup[0].username,
                      userId: userLookup[0].id,
                      verifyToken: forgotPasswordCode,
                      host: process.env.HOST_NAME
                    }
                  });

                  req.$service.buildPageResponse(res, `forgot_password`, {
                    success: "An email has been sent."
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
              id
            };

            try {
              const isValidCodeForUser = await req.$ctx.call(
                "verification_code.verifyCode",
                {
                  code,
                  userId: id,
                  type: "PASSWORD_RESET_REQUEST"
                }
              );

              if (!isValidCodeForUser) {
                params = {
                  ...params,
                  error: "Invalid password reset link"
                };
              } else {
                // If the password request request was valid and not used
                // then lets create one for the action
                const forgotPasswordActionCode = await req.$ctx.call(
                  "verification_code.getCode",
                  {
                    userId: id,
                    type: "PASSWORD_RESET_ACTION"
                  }
                );

                // Here we override the request code for the
                // action code
                params = {
                  ...params,
                  code: forgotPasswordActionCode
                };
              }
            } catch (error) {
              params = {
                ...params,
                error: error.message
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
                  id: parsedBody.id
                };

                try {
                  const userLookup = await req.$ctx.call(
                    "user.changePassword",
                    {
                      ...parsedBody
                    }
                  );

                  params = {
                    ...params,
                    success: `Congrats ${userLookup.firstName}, you're password reset is complete.`
                  };
                } catch (error) {
                  params = {
                    ...params,
                    error: error.message
                  };
                }

                req.$service.buildPageResponse(res, `forgot_password`, params);
              });
          }
        }
      },
    ],
    // Serve assets from "public" folder
    assets: {
      folder: "public"
    }
  },

  methods: {
    renderPage(name: string, params: object, options: object): string {
      var fn = pug.compileFile(
        `${__dirname.split("services")[0]}pages/${name}.pug`,
        options
      );
      return fn(params);
    },
    buildPageResponse(res: any, page: string, payload: {}): any {
      const html = this.renderPage(page, payload, {});
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.write(html);
      return res.end();
    }
  }
};

export = ApiService;
