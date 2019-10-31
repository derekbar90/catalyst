"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
exports.database = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.DB_NAME}`;
exports.dbAdapter = new SqlAdapter(exports.database);
exports.dbSequalizeAdapter = new sequelize_1.Sequelize(exports.database);
//# sourceMappingURL=database.js.map