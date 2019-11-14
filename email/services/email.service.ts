"use strict";
import { Context, ServiceSchema } from "moleculer";
//@ts-ignore
const MailService = require("moleculer-mail");
const path = require("path");
const mailgunTransport = require('nodemailer-mailgun-transport');

const EmailService: ServiceSchema = {
  name: "mail",

  /**
   * Service settings
   */
  settings: {
	  $secureSettings: ["transport.auth.api_key", "transport.auth.domain"],
    // if you want you can create different servcies for different outbound addresses
    // This helps seperate the concerns of the templating and makes readibility on
    // broker calls easier
    from: `catalyst@${process.env.EMAIL_DOMAIN}`,
    transport: mailgunTransport({
      service: process.env.EMAIL_PROVIDER || "missing_in_env",
      auth: {
        api_key: process.env.EMAIL_API_KEY || "missing_in_env",
    	  domain: process.env.EMAIL_DOMAIN || "missing_in_env",
      }
    }),
	  templateFolder: path.join(__dirname.split('services')[0], "templates")
  },

  /**
   * Service dependencies
   */
  dependencies: [],

  /**
   * mixin dependencies
   */
  mixins: [MailService],

  /**
   * Actions
   */
  actions: {},

  /**
   * Events
   */
  events: {
    // Subscribe to `user.created` event
    "user.registered"(user: {
      firstName: string,
      email: string,
    }) {
      this.actions.send({
        to: user.email,
        template: "welcome",
        data: {
          firstName: user.firstName,
          host: process.env.HOST_NAME
        }
      });
    },
  },

  /**
   * Methods
   */
  methods: {},

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

export = EmailService;
