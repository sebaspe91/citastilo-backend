import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: PERMISOS DEL ROL (pivote: rol + módulo + acción)
class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
  declare id_role_permission: CreationOptional<string>;
  declare role_id: string;
  declare module_id: string;
  declare action_id: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RolePermission.init(
    {
        id_role_permission: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        role_id: { 
            type: DataTypes.UUID, allowNull: false 
        },
        module_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        action_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, 
    { 
        sequelize: db, 
        tableName: 'role_permissions' 
    }
);

export default RolePermission;