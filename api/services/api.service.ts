import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");
const { ApolloService } = require("moleculer-apollo-server");
const Kind							= require("graphql/language").Kind;

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
								__parseLiteral(ast: { value: any, kind: any }) {
									if (ast.kind === Kind.INT)
										return parseInt(ast.value, 10); // ast value is always in string format

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
							tracing: true,
					}
        })
	],

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
			},
		],
		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},
	},

	methods: {
	},
};

export = ApiService;