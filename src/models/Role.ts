import { 
    Model, 
    DataTypes, 
    InferAttributes, 
    InferCreationAttributes, 
    CreationOptional 
} from 'sequelize';
import db from '../config/db';

// Modelo: ROLES (cargos de cada empresa: admin, estilista, recepcionista...)
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id_role: CreationOptional<string>;
  declare company_id: string;
  declare name_role: string;
  declare code_role: string;
  declare description_role: CreationOptional<string | null>;
  declare is_system: CreationOptional<boolean>;   // true = no se puede editar ni borrar
  declare status_role: CreationOptional<'active' | 'inactive'>;
  declare delete_role: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Role.init(
    {
        id_role: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        company_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        name_role: { 
            type: DataTypes.STRING(50), 
            allowNull: false 
        },
        code_role: { 
            type: DataTypes.STRING(20), 
            allowNull: false 
        },
        description_role: { 
            type: DataTypes.STRING(255) 
        },
        is_system: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false 
        },
        status_role: { 
            type: DataTypes.ENUM('active', 'inactive'), 
            allowNull: false, 
            defaultValue: 'active' 
        },
        delete_role: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false 
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, 
    { 
        sequelize: db, 
        tableName: 'roles' 
    }
);

export default Role;