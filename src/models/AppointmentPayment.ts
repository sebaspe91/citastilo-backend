import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: PAGOS DE LA CITA (lo que paga el CLIENTE; puede pagar en varios abonos)
class AppointmentPayment extends Model<InferAttributes<AppointmentPayment>, InferCreationAttributes<AppointmentPayment>> {
  declare id_appointment_payment: CreationOptional<string>;
  declare company_id: string;
  declare appointment_id: string;
  declare amount: string;                                      // DECIMAL como TEXTO
  declare payment_method: 'cash' | 'card' | 'transfer' | 'nequi' | 'daviplata' | 'other';
  declare reference_number: CreationOptional<string | null>;
  declare paid_at: CreationOptional<Date>;                     // por defecto: ahora
  declare status_payment: CreationOptional<'completed' | 'refunded' | 'voided'>;
  declare received_by: CreationOptional<string | null>;        // usuario que recibió el pago
  declare notes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AppointmentPayment.init({
  id_appointment_payment: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  appointment_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  amount: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    validate: { min: 0.01 } 
},
  payment_method: { 
    type: DataTypes.ENUM('cash', 'card', 'transfer', 'nequi', 'daviplata', 'other'), 
    allowNull: false 
  },
  reference_number: { 
    type: DataTypes.STRING(100) 
  },
  paid_at: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },
  status_payment: { 
    type: DataTypes.ENUM('completed', 'refunded', 'voided'), 
    allowNull: false, 
    defaultValue: 'completed' 
  },
  received_by: { 
    type: DataTypes.UUID 
  },
  notes: { 
    type: DataTypes.STRING(255) 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'appointment_payments' });

export default AppointmentPayment;