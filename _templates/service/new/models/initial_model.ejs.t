---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/models/' + h.changeCase.snakeCase(name) + '.ts' : null %>"
---
import { DataTypes, Model, BuildOptions } from 'sequelize';
import { dbSequalizeAdapter } from '../database/database';

type Narrowable = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Narrowable[]>(...t: T)=> t;

const modelDefinition = {
  name: "<%=h.changeCase.pascalCase(name)%>",
  define: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
<%_  if(locals.dbTypeMap) { -%>
  <%_ Object.keys(locals.dbTypeMap).forEach(function(fieldName){-%>
    <%=fieldName%>: {
<%_ if(locals.dbTypeMap[fieldName].modelType == "ENUM") { -%>
      type: DataTypes.<%=locals.dbTypeMap[fieldName].modelType-%>(
        <% locals.enumTypeMap[fieldName].enumTypes.split(',').map(function(value){return h.changeCase.upper(h.inflection.underscore(value, true))}).forEach(function(enumName){-%>"<%=enumName%>",<%_ })%>
      ),
<%_ } else { -%>
      type: DataTypes.<%=locals.dbTypeMap[fieldName].modelType -%>,
<%_ } -%>
      allowNull: <%=Boolean(locals.dbTypeMap[fieldName].allowNull) -%>,
<%_ if(locals.dbTypeMap[fieldName].defaultValue) { -%>
    <%_ if(locals.dbTypeMap[fieldName].modelType == "ENUM") { -%>
      defaultValue: "<%=locals.dbTypeMap[fieldName].defaultValue%>"
    <%_ } else if(locals.dbTypeMap[fieldName].modelType == "BOOLEAN") { -%>
      defaultValue: <%=Boolean(locals.dbTypeMap[fieldName].defaultValue)%>
    <%_ } else { -%>
      defaultValue: <%=locals.dbTypeMap[fieldName].defaultValue%>
    <%_ } -%>
<%_ } -%>
    },
  <%_ }) -%>
<%_ } -%>
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }
}

<%_ if(locals.enumTypeMap && Object.keys(locals.enumTypeMap).length > 0) { -%>
<%_ Object.keys(locals.enumTypeMap).forEach(function(fieldName){ -%>
export enum <%= h.changeCase.pascalCase(fieldName) %> {
<%_ locals.enumTypeMap[fieldName].enumTypes.split(',').forEach(function(enumName){ -%>
  <%= h.changeCase.constantCase(enumName) %> = "<%= h.changeCase.constantCase(enumName) %>",
<%_ }) -%>
}

<%_ }) -%>
<%_ } -%>
export interface I<%=h.changeCase.pascalCase(name)%>Model extends Model {
  id: string;
<%_ if(locals.dbTypeMap) { -%>
  <%_ Object.keys(locals.dbTypeMap).forEach(function(fieldName){ -%>
<%_ if(locals.dbTypeMap[fieldName].modelType == "ENUM") { -%>
  <%= fieldName %>: <%=h.changeCase.pascalCase(fieldName)%>;
<%_ } else if (locals.dbTypeMap[fieldName].modelType == "ARRAY(DataTypes.STRING)") { -%>
  <%= fieldName %>: <%=locals.dbTypeMap[fieldName].typescriptType-%><string>;
<%_ } else { -%>
  <%= fieldName %>: <%=locals.dbTypeMap[fieldName].typescriptType-%>;
<%_ }})} -%>
}

type <%=h.changeCase.pascalCase(name)%>ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): I<%=h.changeCase.pascalCase(name)%>Model;
}

export const <%=h.changeCase.pascalCase(name)%>SequelizeModel = modelDefinition;

export const <%=h.changeCase.pascalCase(name)%>Model = <<%=h.changeCase.pascalCase(name)%>ModelStatic>dbSequalizeAdapter.define(modelDefinition.name, modelDefinition.define, {});
