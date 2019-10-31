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
                return `Welcome!, ${ctx.params.name}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3Jvb3QvY2F0YWx5c3QvdXNlci9zZXJ2aWNlcy91c2VyLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9yb290L2NhdGFseXN0L3VzZXIvc2VydmljZXMvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7QUFFYixhQUFhO0FBQ2Isd0RBQTBDO0FBQzFDLG1EQUFpRDtBQUNqRCx5Q0FBb0Q7QUFFcEQsTUFBTSxXQUFXLEdBQWtCO0lBQ2xDLElBQUksRUFBRSxNQUFNO0lBRVo7O09BRUc7SUFDSCxRQUFRLEVBQUU7UUFDSCxNQUFNLEVBQUU7WUFDYixJQUFJO1lBQ0osVUFBVTtZQUNWLFdBQVc7WUFDWCxVQUFVO1lBQ1YsT0FBTztZQUNQLFVBQVU7WUFDVixRQUFRO1lBQ1IsYUFBYTtZQUNiLFFBQVE7WUFDUixNQUFNO1lBQ04sVUFBVTtZQUNWLGFBQWE7WUFDYixXQUFXO1lBQ1gsV0FBVztTQUNYO0tBQ0U7SUFDSixPQUFPLEVBQUUsb0JBQVM7SUFDbEIsS0FBSyxFQUFFO1FBQ04sa0JBQWtCLEVBQWxCLHlCQUFrQjtRQUNsQixPQUFPLEVBQUUsRUFBRTtLQUNYO0lBQ0Q7O09BRUc7SUFDSCxZQUFZLEVBQUUsRUFBRTtJQUVoQjs7T0FFRztJQUNILE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztJQUVuQjs7T0FFRztJQUNILE9BQU8sRUFBRTtRQUVSOzs7O1dBSUc7UUFDSCxLQUFLO1lBQ0osT0FBTyxpQkFBaUIsQ0FBQztRQUMxQixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILE9BQU8sRUFBRTtZQUNSLE1BQU0sRUFBRTtnQkFDUCxJQUFJLEVBQUUsUUFBUTthQUNkO1lBQ0QsT0FBTyxDQUFDLEdBQThCO2dCQUNyQyxPQUFPLGFBQWEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QyxDQUFDO1NBQ0Q7S0FDRDtJQUVEOztPQUVHO0lBQ0gsTUFBTSxFQUFFLEVBRVA7SUFFRDs7T0FFRztJQUNILE9BQU8sRUFBRSxFQUVSO0lBRUQ7O09BRUc7SUFDSCxPQUFPO0lBQ1AsQ0FBQztDQWVELENBQUM7QUFFRixpQkFBUyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmltcG9ydCB7Q29udGV4dCwgU2VydmljZVNjaGVtYX0gZnJvbSBcIm1vbGVjdWxlclwiO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0ICogYXMgRGJTZXJ2aWNlIGZyb20gXCJtb2xlY3VsZXItZGJcIjtcbmltcG9ydCB7IGRiQWRhcHRlciB9IGZyb20gXCIuLi9kYXRhYmFzZS9kYXRhYmFzZVwiO1xuaW1wb3J0IHsgVXNlclNlcXVlbGl6ZU1vZGVsIH0gZnJvbSBcIi4uL21vZGVscy91c2VyXCI7XG5cbmNvbnN0IFVzZXJTZXJ2aWNlOiBTZXJ2aWNlU2NoZW1hID0ge1xuXHRuYW1lOiBcInVzZXJcIixcblxuXHQvKipcblx0ICogU2VydmljZSBzZXR0aW5nc1xuXHQgKi9cblx0c2V0dGluZ3M6IHtcbiAgICAgICAgZmllbGRzOiBbIFxuXHRcdFx0XCJpZFwiLCBcblx0XHRcdFwidXNlcm5hbWVcIiwgXG5cdFx0XHRcImZpcnN0TmFtZVwiLCBcblx0XHRcdFwibGFzdE5hbWVcIiwgXG5cdFx0XHRcImVtYWlsXCIsIFxuXHRcdFx0XCJwYXNzd29yZFwiLCBcblx0XHRcdFwiYXZhdGVyXCIsIFxuXHRcdFx0XCJzb2NpYWxMaW5rc1wiLCBcblx0XHRcdFwic3RhdHVzXCIsIFxuXHRcdFx0XCJwbGFuXCIsIFxuXHRcdFx0XCJ2ZXJpZmllZFwiLCBcblx0XHRcdFwibGFzdExvZ2luQXRcIiwgXG5cdFx0XHRcImNyZWF0ZWRBdFwiLCBcblx0XHRcdFwidXBkYXRlZEF0XCJcblx0XHRdLFxuICAgIH0sXG5cdGFkYXB0ZXI6IGRiQWRhcHRlcixcblx0bW9kZWw6IHtcblx0XHRVc2VyU2VxdWVsaXplTW9kZWwsXG5cdFx0b3B0aW9uczoge31cblx0fSxcblx0LyoqXG5cdCAqIFNlcnZpY2UgZGVwZW5kZW5jaWVzY2QgXG5cdCAqL1xuXHRkZXBlbmRlbmNpZXM6IFtdLFxuXG5cdC8qKlxuXHQgKiBtaXhpbiBkZXBlbmRlbmNpZXNcblx0ICovXG5cdG1peGluczogW0RiU2VydmljZV0sXG5cblx0LyoqXG5cdCAqIEFjdGlvbnNcblx0ICovXG5cdGFjdGlvbnM6IHtcblxuXHRcdC8qKlxuXHRcdCAqIFNheSBhICdIZWxsbydcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zXG5cdFx0ICovXG5cdFx0aGVsbG8oKSB7XG5cdFx0XHRyZXR1cm4gXCJIZWxsbyBNb2xlY3VsZXJcIjtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogV2VsY29tZSBhIHVzZXJuYW1lXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFVzZXIgbmFtZVxuXHRcdCAqL1xuXHRcdHdlbGNvbWU6IHtcblx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRuYW1lOiBcInN0cmluZ1wiLFxuXHRcdFx0fSxcblx0XHRcdGhhbmRsZXIoY3R4OiBDb250ZXh0PHsgbmFtZTogc3RyaW5nIH0+KSB7XG5cdFx0XHRcdHJldHVybiBgV2VsY29tZSEsICR7Y3R4LnBhcmFtcy5uYW1lfWA7XG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cblx0LyoqXG5cdCAqIEV2ZW50c1xuXHQgKi9cblx0ZXZlbnRzOiB7XG5cblx0fSxcblxuXHQvKipcblx0ICogTWV0aG9kc1xuXHQgKi9cblx0bWV0aG9kczoge1xuXG5cdH0sXG5cblx0LyoqXG5cdCAqIFNlcnZpY2UgY3JlYXRlZCBsaWZlY3ljbGUgZXZlbnQgaGFuZGxlclxuXHQgKi9cblx0Y3JlYXRlZCgpIHtcblx0fSxcblxuXHQvKipcblx0ICogU2VydmljZSBzdGFydGVkIGxpZmVjeWNsZSBldmVudCBoYW5kbGVyXG5cdCAqL1xuXHQvLyBhc3luYyBzdGFydGVkKCkge1xuXG5cdC8vIH0sXG5cblx0LyoqXG5cdCAqIFNlcnZpY2Ugc3RvcHBlZCBsaWZlY3ljbGUgZXZlbnQgaGFuZGxlclxuXHQgKi9cblx0Ly8gYXN5bmMgc3RvcHBlZCgpIHtcblxuXHQvLyB9LFxufTtcblxuZXhwb3J0ID0gVXNlclNlcnZpY2U7XG4iXX0=