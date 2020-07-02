---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/migrations/20191030192401-create-' + h.changeCase.paramCase(name) + '.ts' : null %>"
---
'use strict';

const { <%=h.changeCase.pascalCase(name)%>SequelizeModel } = require('../models/<%=h.changeCase.snakeCase(name)%>');
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const dbName = <%=h.changeCase.pascalCase(name)%>SequelizeModel.name.split('').pop() == 's' ? <%=h.changeCase.pascalCase(name)%>SequelizeModel.name : `${<%=h.changeCase.pascalCase(name)%>SequelizeModel.name}s`
    return queryInterface.createTable(dbName, <%=h.changeCase.pascalCase(name)%>SequelizeModel.define);
  },
  down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const dbName = <%=h.changeCase.pascalCase(name)%>SequelizeModel.name.split('').pop() == 's' ? <%=h.changeCase.pascalCase(name)%>SequelizeModel.name : `${<%=h.changeCase.pascalCase(name)%>SequelizeModel.name}s`
    return queryInterface.dropTable(<%=h.changeCase.pascalCase(name)%>SequelizeModel.name);
  }
};
