'use strict';

const { VerificationCodeSequelizeModel } = require('../models/verification_code');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(VerificationCodeSequelizeModel.name, VerificationCodeSequelizeModel.define);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(VerificationCodeSequelizeModel.name);
  }
};