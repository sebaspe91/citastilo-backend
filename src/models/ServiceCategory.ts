import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: CATEGORÍAS DE SERVICIOS (Cortes, Barba, Uñas, Color...)
class ServiceCategory extends Model<InferAttributes<ServiceCategory>, InferCreationAttributes<ServiceCategory>> {
  declare id_service_category: CreationOptional<string>;
  declare company_id: string;
  declare name_category: string;
  declare description_category: CreationOptional<string | null>;
  declare sort_order: CreationOptional<number>;
  declare status_category: CreationOptional<'active' | 'inactive'>;
  declare delete_category: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ServiceCategory.init({
  id_service_category: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  name_category: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  description_category: { 
    type: DataTypes.STRING(255) 
  },
  sort_order: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0 
  },
  status_category: { 
    type: DataTypes.ENUM('active', 'inactive'), 
    allowNull: false, 
    defaultValue: 'active' 
  },
  delete_category: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'service_categories' });

export default ServiceCategory;