import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");

const ApiService: ServiceSchema = {
	name: "api",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		path: "/api",

		routes: [
			{
				path: "/",
				whitelist: [
					"**",
				],
				authorization: true,
			},
		],
		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},
	},
	
	methods: {
		authorize(ctx, route, req, res) {
			let auth = req.headers['authorization'];
			console.log('dumb');
			console.log('dumb');
		}
	}
};

export = ApiService;
