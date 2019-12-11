---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/migrations/20191030192401-create-' + h.changeCase.paramCase(name) + '.ts' : null %>"
---
'use strict';

const { <%=h.changeCase.pascalCase(name)%>SequelizeModel } = require('../models/<%=h.changeCase.pascalCase(name)%>');
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.createTable(<%=h.changeCase.pascalCase(name)%>SequelizeModel.name, <%=h.changeCase.pascalCase(name)%>SequelizeModel.define);
  },
  down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.dropTable(<%=h.changeCase.pascalCase(name)%>SequelizeModel.name);
  }
};