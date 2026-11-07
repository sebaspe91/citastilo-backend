import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: SERVICIOS (Corte clásico, Barba, Tinte...)
class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
  declare id_service: CreationOptional<string>;
  declare company_id: string;
  declare category_id: string;
  declare name_service: string;
  declare description_service: CreationOptional<string | null>;
  declare price_service: string;                              // DECIMAL llega como TEXTO: '25000.00'
  declare duration_minutes_service: number;
  declare image_url_service: CreationOptional<string | null>;
  declare status_service: CreationOptional<'active' | 'inactive'>;
  declare delete_service: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Service.init({
  id_service: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  category_id: { type: DataTypes.UUID, allowNull: false },
  name_service: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  description_service: { 
    type: DataTypes.TEXT 
  },
  price_service: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    validate: { min: 0 } 
},
  duration_minutes_service: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1 } 
},
  image_url_service: { 
    type: DataTypes.STRING(255) 
  },
  status_service: { 
    type: DataTypes.ENUM('active', 'inactive'), 
    allowNull: false, 
    defaultValue: 'active' 
  },
  delete_service: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'services' });

export default Service;