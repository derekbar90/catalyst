"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const tuple = (...t) => t;
const modelDefinition = {
    name: "user",
    define: {
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: {
                    msg: 'Please provide field within 2 to 200 characters.',
                    args: tuple(2, 200),
                }
            }
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: {
                    args: tuple(2, 200),
                    msg: 'Please provide field within 2 to 200 characters.'
                }
            }
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: {
                    args: tuple(2, 200),
                    msg: 'Please provide field within 2 to 200 characters.'
                }
            }
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: false,
                len: {
                    args: tuple(2, 200),
                    msg: 'Please provide field within 2 to 200 characters.'
                }
            }
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
        },
        avater: {
            type: sequelize_1.DataTypes.STRING,
        },
        socialLinks: {
            type: sequelize_1.DataTypes.JSON,
        },
        status: {
            type: sequelize_1.DataTypes.INTEGER,
        },
        plan: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['TRIAL', 'FREE', 'PAID_LEVEL_1', 'PAID_LEVEL_2', 'PAID_LEVEL_3'],
            allowNull: false
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        },
        lastLoginAt: {
            type: sequelize_1.DataTypes.DATE,
        },
        // Timestamps
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }
};
exports.UserSequelizeModel = modelDefinition;
exports.UserModel = database_1.dbSequalizeAdapter.define(modelDefinition.name, modelDefinition.define, {});
//# sourceMappingURL=user.js.map