"use strict";
import {Context, ServiceSchema} from "moleculer";
// @ts-ignore
import * as DbService from "moleculer-db";
import { dbAdapter } from "../database/database";
import { UserSequelizeModel } from "../models/user";

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
			"avater", 
			"socialLinks", 
			"status", 
			"plan", 
			"verified", 
			"lastLoginAt", 
			"createdAt", 
			"updatedAt"
		],
    },
	adapter: dbAdapter,
	model: {
		UserSequelizeModel,
		options: {}
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
			handler(ctx: Context<{ name: string }>) {
				return `Welcome!, ${ctx.params.name}`;
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

export = UserService;
