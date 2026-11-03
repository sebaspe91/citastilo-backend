import { 
    Model, 
    DataTypes, 
    InferAttributes, 
    InferCreationAttributes, 
    CreationOptional 
} from 'sequelize';
import db from '../config/db';

// Modelo: ACCIONES (catálogo global: create, read, update, delete, export, approve)
class Action extends Model<InferAttributes<Action>, InferCreationAttributes<Action>> {
  declare id_action: CreationOptional<string>;
  declare name_action: string;
  declare code_action: string;
  declare description_action: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Action.init(
    {
        id_action: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true    
        },
        name_action: { 
            type: DataTypes.STRING(50), 
            allowNull: false 
        },
        code_action: { 
            type: DataTypes.STRING(30), 
            allowNull: false, 
            unique: true 
        },
        description_action: { 
            type: DataTypes.STRING(255) 
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, 
    { 
        sequelize: db, 
        tableName: 'actions' 
    }
);

export default Action;