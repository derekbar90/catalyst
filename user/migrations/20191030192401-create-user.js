'use strict';

const UserSequelizeModel = require('../models/user');

console.log(UserSequelizeModel)

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(UserSequelizeModel.name, UserSequelizeModel);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(UserSequelizeModel.name);
  }
};