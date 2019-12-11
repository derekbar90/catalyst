---
to: <%=h.changeCase.snakeCase(name)%>/services/<%=h.changeCase.snakeCase(name)%>.service.ts
---

"use strict";
import {Context, ServiceSchema} from "moleculer";
// @ts-ignore
import * as DbService from "moleculer-db";

const <%=h.changeCase.pascalCase(name)%>Service: ServiceSchema = {
	name: "<%=h.changeCase.snakeCase(name)%>",

	/**
	 * Service settings
	 */
	settings: {
<% if(locals.shouldAddDb){ -%>
        fields: [
            <% Object.keys(locals.dbTypeMap).forEach(function(type){ %>"<%-type%>",
<% }); -%>
        ],
<% } -%>
    },

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * mixin dependencies
	 */
	mixins: [
        <% if(locals.shouldAddDb){ -%>DbService
<% } -%>
    ],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * return an echo of the var
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
		welcomePermissioned: {
			permissions: [
				{
					subject: "user",
					action: "read",
					flavor: "exact"
				}
			],
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

export = <%=h.changeCase.pascalCase(name)%>Service;