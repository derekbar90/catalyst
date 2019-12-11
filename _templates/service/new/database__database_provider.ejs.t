---
to: <%=h.changeCase.snakeCase(name)%>/database/database.ts
---
import { Sequelize } from "sequelize";

const SqlAdapter = require("moleculer-db-adapter-sequelize");

export const database = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.DB_NAME}` 
export const dbAdapter = new SqlAdapter(database)
export const dbSequalizeAdapter = new Sequelize(database)