'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { VerificationCodeSequelizeModel } = require('../models/verification_code');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(VerificationCodeSequelizeModel.name, VerificationCodeSequelizeModel.define);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(VerificationCodeSequelizeModel.name);
    }
};
//# sourceMappingURL=20191030192401-create-verification-code-table.js.map