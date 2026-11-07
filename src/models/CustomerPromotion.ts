import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: PROMOCIONES DEL CLIENTE (premios o promociones asignadas a un cliente)
class CustomerPromotion extends Model<InferAttributes<CustomerPromotion>, InferCreationAttributes<CustomerPromotion>> {
  declare id_customer_promotion: CreationOptional<string>;
  declare company_id: string;
  declare customer_id: string;
  declare promotion_id: string;
  declare status_customer_promotion: CreationOptional<'available' | 'used' | 'expired'>;
  declare assigned_at: CreationOptional<Date>;               // por defecto: ahora
  declare expires_at: CreationOptional<Date | null>;         // nulo = no vence
  declare used_at: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CustomerPromotion.init({
  id_customer_promotion: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  customer_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  promotion_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  status_customer_promotion: { 
    type: DataTypes.ENUM('available', 'used', 'expired'), 
    allowNull: false, 
    defaultValue: 'available' 
  },
  assigned_at: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },
  expires_at: { 
    type: DataTypes.DATE 
  },
  used_at: { 
    type: DataTypes.DATE 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'customer_promotions' });

export default CustomerPromotion;