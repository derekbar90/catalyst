'use strict';

const { VerificationCodeSequelizeModel } = require('../models/verification_code');
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.createTable(VerificationCodeSequelizeModel.name, VerificationCodeSequelizeModel.define);
  },
  down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.dropTable(VerificationCodeSequelizeModel.name);
  }
};