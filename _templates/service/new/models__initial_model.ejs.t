---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/models/' + h.changeCase.paramCase(name) + '.ts' : null %>"
---
import { DataTypes, Model, BuildOptions } from 'sequelize';
import { dbSequalizeAdapter } from '../database/database';

type Narrowable = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Narrowable[]>(...t: T)=> t;

const modelDefinition = {
  name: "user",
  define: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          msg: 'Please provide field within 2 to 200 characters.',
          args: tuple(2, 200),
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: tuple(2, 200),
          msg: 'Please provide field within 2 to 200 characters.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: tuple(2, 200),
          msg: 'Please provide field within 2 to 200 characters.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: false,
        len: {
          args: tuple(2, 200),
          msg: 'Please provide field within 2 to 200 characters.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    socialLinks: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    plan: {
      type: DataTypes.ENUM,
      values: ['TRIAL', 'FREE', 'PAID_LEVEL_1', 'PAID_LEVEL_2', 'PAID_LEVEL_3'],
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
    },

    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }
}

export interface IUserModel extends Model {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  socialLinks: any;
  status: number;
  plan: any;
  verified: boolean;
  lastLoginAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IUserModel;
}

export const UserSequelizeModel = modelDefinition;

export const UserModel = <UserModelStatic>dbSequalizeAdapter.define(modelDefinition.name, modelDefinition.define, {});