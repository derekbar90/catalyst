"use strict";
import { ServiceSchema } from "moleculer";
// @ts-ignore
import * as DbService  from "moleculer-db";

const GreeterService: ServiceSchema = {
	name: "user",

	/**
	 * Service settings
	 */
	settings: {
        fields: ["_id", "username", "name"],
    },

	/**
	 * Service dependencies
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
		hello() {
			return "Hello Moleculer";
		},

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			params: {
				name: "string",
			},
			handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			},
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

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

export = GreeterService;
