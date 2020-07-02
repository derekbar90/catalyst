---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/database/database.ts' : null %>"
---
import { Sequelize } from "sequelize";

const SqlAdapter = require("moleculer-db-adapter-sequelize");

export const database = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.DB_NAME}` 
export const dbAdapter = new SqlAdapter(process.env.DB_NAME, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    pool: {
        max: process.env.DB_POOL_MAX || 5,
        min: process.env.DB_POOL_MIN || 0,
        idle: process.env.DB_POOL_IDLE || 10000
    },
    noSync: process.env.DB_SKIP_MODEL_SYNC || true
})
export const dbSequalizeAdapter = new Sequelize(database)