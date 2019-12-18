import { DataTypes, Model, BuildOptions } from 'sequelize';
import { dbSequalizeAdapter } from '../database/database';

type Narrowable = string | number | boolean | undefined | null | void | {};
const tuple = <T extends Narrowable[]>(...t: T)=> t;

const modelDefinition = {
  name: "verification_codes",
  define: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['USER_ACCOUNT', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_ACTION', 'PHONE_NUMBER'],
      allowNull: false
    },

    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }
}

export interface IVerificationCodeModel extends Model {
  id: string;
  userId: string;
  code: string;
  verified: boolean;
  type: any;
  
  createdAt: Date;
  updatedAt: Date;
}

type VerificationCodeModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IVerificationCodeModel;
}

export const VerificationCodeSequelizeModel = modelDefinition;

export const VerificationCodeModel = <VerificationCodeModelStatic>dbSequalizeAdapter.define(modelDefinition.name, modelDefinition.define, {});