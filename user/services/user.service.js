"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
// @ts-ignore
const DbService = __importStar(require("moleculer-db"));
const GreeterService = {
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
    events: {},
    /**
     * Methods
     */
    methods: {},
    /**
     * Service created lifecycle event handler
     */
    created() {
    },
};
module.exports = GreeterService;
//# sourceMappingURL=user.service.js.map