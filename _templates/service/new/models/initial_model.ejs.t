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

    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }
}

export interface I<%=h.changeCase.pascalCase(name)%>Model extends Model {
  id: string;
}

type <%=h.changeCase.pascalCase(name)%>ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): I<%=h.changeCase.pascalCase(name)%>Model;
}

export const <%=h.changeCase.pascalCase(name)%>SequelizeModel = modelDefinition;

export const <%=h.changeCase.pascalCase(name)%>Model = <<%=h.changeCase.pascalCase(name)%>ModelStatic>dbSequalizeAdapter.define(modelDefinition.name, modelDefinition.define, {});