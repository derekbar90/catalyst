---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/migrations/20191030192401-create-' + h.changeCase.paramCase(name) + '.ts' : null %>"
---
'use strict';

const { UserSequelizeModel } = require('../models/user');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(UserSequelizeModel.name, UserSequelizeModel.define);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(UserSequelizeModel.name);
  }
};