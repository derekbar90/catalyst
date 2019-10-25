import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");

const ApiService: ServiceSchema = {
	name: "hydra",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3030,

		routes: [{
			aliases: {
				// Call `auth.login` action with `GET /login` or `POST /login`
				"login": "auth.login",

				// Restrict the request method
				"POST users": "users.create",

				// The `name` comes from named param.
				// You can access it with `ctx.params.name` in action
				"GET greeter/:name": "test.greeter",
			}
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},
	},
};

export = ApiService;
