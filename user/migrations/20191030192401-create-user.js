'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { UserSequelizeModel } = require('../models/user');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(UserSequelizeModel.name, UserSequelizeModel.define);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(UserSequelizeModel.name);
    }
};
//# sourceMappingURL=20191030192401-create-user.js.map