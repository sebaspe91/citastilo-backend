import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: CLIENTES (las personas que agendan citas)
class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
  declare id_customer: CreationOptional<string>;
  declare company_id: string;
  declare first_name: string;
  declare last_name: CreationOptional<string | null>;
  declare document_type: CreationOptional<'CC' | 'CE' | 'TI' | 'PP' | null>;
  declare document_number: CreationOptional<string | null>;
  declare email_customer: CreationOptional<string | null>;
  declare phone_customer: string;                             // obligatorio (NO es único)
  declare birth_date: CreationOptional<string | null>;        // DATEONLY: '1995-08-20'
  declare notes: CreationOptional<string | null>;
  declare promotion_counter: CreationOptional<number>;        // visitas completadas y pagadas
  declare has_promotion: CreationOptional<boolean>;           // tiene un premio sin usar
  declare status_customer: CreationOptional<'active' | 'inactive' | 'blocked'>;
  declare delete_customer: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Customer.init({
  id_customer: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  first_name: { 
    type: DataTypes.STRING(80), 
    allowNull: false 
  },
  last_name: { 
    type: DataTypes.STRING(80) 
  },
  document_type: { 
    type: DataTypes.ENUM('CC', 'CE', 'TI', 'PP') 
  },
  document_number: { 
    type: DataTypes.STRING(20) 
  },
  email_customer: { 
    type: DataTypes.STRING(150), 
    validate: { isEmail: true } 
},
  phone_customer: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  birth_date: { 
    type: DataTypes.DATEONLY 
  },
  notes: { 
    type: DataTypes.TEXT 
  },
  promotion_counter: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
},
  has_promotion: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  status_customer: { 
    type: DataTypes.ENUM('active', 'inactive', 'blocked'), 
    allowNull: false, 
    defaultValue: 'active' 
  },
  delete_customer: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'customers' });

export default Customer;