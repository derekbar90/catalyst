'use strict';

const { UserSequelizeModel } = require('../models/user');
import { QueryInterface, Sequelize } from 'sequelize';


module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.createTable(UserSequelizeModel.name, UserSequelizeModel.define);
  },
  down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.dropTable(UserSequelizeModel.name);
  }
};