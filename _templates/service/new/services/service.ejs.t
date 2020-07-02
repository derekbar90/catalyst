---
to: <%=h.changeCase.snakeCase(name)%>/services/<%=h.changeCase.snakeCase(name)%>.service.ts
---

"use strict";
import {Context, ServiceSchema} from "moleculer";

<% if(locals.shouldAddDb){ -%>
// @ts-ignore
import DbService from "moleculer-db";
import { dbAdapter } from "../database/database";
import { ServiceDependencyCacheCleaner } from "../mixins/cacheCleaner";
import { <%=h.changeCase.pascalCase(name)%>SequelizeModel, I<%=h.changeCase.pascalCase(name)%>Model } from "../models/<%=h.changeCase.snakeCase(name)%>";
import { IsOwnerMixin } from "@thesatoshicompany/moleculer-keto";
import { MoleculerDBGraphQLMixin } from "@thesatoshicompany/moleculer-db-graphql";
<% } -%>

const <%=h.changeCase.pascalCase(name)%>Service: ServiceSchema = {
	name: "<%=h.changeCase.snakeCase(name)%>",
    version: 1,
	/**
	 * Service settings
	 */
	settings: {
<% if(locals.shouldAddDb){ -%>
		fields: [
      		"id",
			"createdAt",
			"updatedAt",
<% if(locals.dbTypeMap) { -%>
    <% Object.keys(locals.dbTypeMap).forEach(function(fieldName){ -%>
		"<%= fieldName %>",
    <% }) -%>
<% } -%>
		],
    	graphql: {
      		type: `
			"""
			This type describes a <%=h.changeCase.pascalCase(name)%> entity.
			"""
			type <%=h.changeCase.pascalCase(name)%> {
				id: String!
				createdAt: Date
<% if(locals.dbTypeMap) {  Object.keys(locals.dbTypeMap).forEach(function(fieldName){ if(locals.dbTypeMap[fieldName].gqlType === "Enum") { -%>
				<%= fieldName %>: <%= h.changeCase.pascalCase(fieldName) -%><%= locals.dbTypeMap[fieldName].allowNull ? '' : '!' %>
<% } else if (locals.dbTypeMap[fieldName].gqlType === "list") { %>
				<%= fieldName %>: [String]<%= locals.dbTypeMap[fieldName].allowNull ? '' : '!' %>
<% } else { %>
				<%= fieldName %>: <%= h.changeCase.pascalCase(locals.dbTypeMap[fieldName].gqlType) -%><%= locals.dbTypeMap[fieldName].allowNull ? '' : '!' %>
<% }})} %>			}

			input <%=h.changeCase.pascalCase(name)%>Input {
<% if(locals.dbTypeMap) { Object.keys(locals.dbTypeMap).forEach(function(fieldName){ if(locals.dbTypeMap[fieldName].gqlType === "Enum") { -%>
				<%= fieldName %>: <%= h.changeCase.pascalCase(fieldName) -%>
<% } else if (locals.dbTypeMap[fieldName].gqlType === "list") { %>
				<%= fieldName %>: [String]
<% } else { %>
				<%= fieldName %>: <%= h.changeCase.pascalCase(locals.dbTypeMap[fieldName].gqlType) -%>
<% }})} %>
			}

			input Update<%=h.changeCase.pascalCase(name)%>Input {
				id: String!
<% if(locals.dbTypeMap) { Object.keys(locals.dbTypeMap).forEach(function(fieldName){ if(locals.dbTypeMap[fieldName].gqlType === "Enum") { -%>
				<%= fieldName %>: <%= h.changeCase.pascalCase(fieldName) -%>
<% } else if (locals.dbTypeMap[fieldName].gqlType === "list") { %>
				<%= fieldName %>: [String]
<% } else { %>
				<%= fieldName %>: <%= h.changeCase.pascalCase(locals.dbTypeMap[fieldName].gqlType) -%>
<% }})} %>
			}

			input Query<%=h.changeCase.pascalCase(name)%>Input {
				id: String
<% if(locals.dbTypeMap) { Object.keys(locals.dbTypeMap).forEach(function(fieldName){ if(locals.dbTypeMap[fieldName].gqlType === "Enum") { -%>
				<%= fieldName %>: <%= h.changeCase.pascalCase(fieldName) -%>
<% } else if (locals.dbTypeMap[fieldName].gqlType === "list") { %>
				<%= fieldName %>: [String]
<% } else { %>
				<%= fieldName %>: <%= h.changeCase.pascalCase(locals.dbTypeMap[fieldName].gqlType) -%>
<% }})} %>
			}

<%_ if(locals.enumTypeMap && Object.keys(locals.enumTypeMap).length > 0) { -%>
	<%_ Object.keys(locals.enumTypeMap).forEach(function(fieldName){ -%>
		enum <%= h.changeCase.pascalCase(fieldName) -%> {
	<%_ locals.enumTypeMap[fieldName].enumTypes.split(',').forEach(function(enumName){ -%>
			<%= h.changeCase.constantCase(enumName) %>
	<%_ }) -%>
		}
    <%_ }) -%>
<%_ } -%>
			`,
      resolvers: {
        <%=h.changeCase.pascalCase(name)%>: {}
      }
    }
<% } -%>
    },
<% if(locals.shouldAddDb){ -%>
	adapter: dbAdapter,
<% } -%>


	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * mixin dependencies
	 */

	mixins: [
<% if(locals.shouldAddDb){ -%>
		MoleculerDBGraphQLMixin(
			"<%=h.changeCase.lower(name)%>s", 
			"<%=h.changeCase.pascalCase(name)-%>",
			{
				id: { type: "uuid", optional: true },
<%_ if(locals.dbTypeMap) { -%>
	<%_ Object.keys(locals.dbTypeMap).forEach(function(fieldName){-%>
				<%_ if(locals.dbTypeMap[fieldName].modelType == "ENUM") { -%>
				<%=fieldName%>: { type: "<%=locals.dbTypeMap[fieldName].paramValidationType-%>", optional: <%=locals.dbTypeMap[fieldName].allowNull-%>, values: [
					<% locals.enumTypeMap[fieldName].enumTypes.split(',').map(function(value){return h.changeCase.upper(h.inflection.underscore(value, true))}).forEach(function(enumName){-%>"<%=enumName%>", <%_ })%>
          		]},
				<%_ } else { -%>
				<%=fieldName%>: { type: "<%=locals.dbTypeMap[fieldName].paramValidationType-%>", optional: <%=locals.dbTypeMap[fieldName].allowNull-%> },
				<%_ } -%>
	<%_ }) -%>
<%_ } -%>
			}
		),
		IsOwnerMixin("<%=h.changeCase.pascalCase(name)-%>"),
		ServiceDependencyCacheCleaner("<%=h.changeCase.snakeCase(name)%>", []),
		DbService
<%_ } -%>
	],

<% if(locals.shouldAddDb){ -%>
	model: {
    	name: <%=h.changeCase.pascalCase(name)%>SequelizeModel.name,
    	define: <%=h.changeCase.pascalCase(name)%>SequelizeModel.define
  	},
<% } -%>

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
				return `Welcome, ${ctx.params.name}!`;
			},
		},
<% if(locals.shouldAddDb){ -%>
	count: {},
    find: {},
    get: {},
    create: {
      permissions: [
        {
          subject: "admin",
          action: "create",
          flavor: "exact",
        },
      ],
    },
    insert: {
      permissions: [
        {
          subject: "admin",
          action: "create",
          flavor: "exact",
        },
      ],
    },
    update: {
      permissions: [
        {
          subject: "admin",
          action: "update",
          flavor: "exact",
        },
      ],
    },
    remove: {
      permissions: [
        {
          subject: "admin",
          action: "delete",
          flavor: "exact",
        },
      ],
    },
<% } -%>
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
    
  	}
}

export = <%=h.changeCase.pascalCase(name)%>Service;
