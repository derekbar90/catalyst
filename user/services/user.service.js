"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
// @ts-ignore
const DbService = __importStar(require("moleculer-db"));
const database_1 = require("../database/database");
const user_1 = require("../models/user");
const UserService = {
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
    adapter: database_1.dbAdapter,
    model: {
        UserSequelizeModel: user_1.UserSequelizeModel,
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
            handler(ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield ctx.call('user.hello');
                    return `Welcome!, ${ctx.params.name}`;
                });
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
module.exports = UserService;
//# sourceMappingURL=user.service.js.map