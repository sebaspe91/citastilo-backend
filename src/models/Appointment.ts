import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: CITAS (quién, con quién, cuándo y cuánto cuesta)
// Sin eliminación lógica: una cita no se borra, se CANCELA con status_appointment
class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
  declare id_appointment: CreationOptional<string>;
  declare company_id: string;
  declare customer_id: string;
  declare staff_id: string;                                    // estilista que atiende
  declare promotion_id: CreationOptional<string | null>;
  declare start_at: Date;                                      // en UTC
  declare end_at: Date;
  declare status_appointment: CreationOptional<'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'>;
  declare subtotal: CreationOptional<string>;                  // DECIMAL como TEXTO
  declare discount_amount: CreationOptional<string>;
  declare total_amount: CreationOptional<string>;
  declare payment_status: CreationOptional<'unpaid' | 'partial' | 'paid' | 'refunded'>;
  declare counted_for_promotion: CreationOptional<boolean>;    // ya sumó al contador del cliente
  declare source: CreationOptional<'web' | 'whatsapp' | 'phone' | 'walk_in' | 'admin'>;
  declare notes: CreationOptional<string | null>;
  declare cancellation_reason: CreationOptional<string | null>;
  declare cancelled_at: CreationOptional<Date | null>;
  declare created_by: CreationOptional<string | null>;         // nulo = la agendó el cliente
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Appointment.init({
  id_appointment: { 
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
  staff_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  promotion_id: { 
    type: DataTypes.UUID 
  },
  start_at: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  end_at: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  status_appointment: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
    allowNull: false,
    defaultValue: 'pending'
  },
  subtotal: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
},
  discount_amount: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
},
  total_amount: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    defaultValue: 0, 
    validate: { min: 0 } 
},
  payment_status: { 
    type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'), 
    allowNull: false, 
    defaultValue: 'unpaid' 
  },
  counted_for_promotion: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  source: { 
    type: DataTypes.ENUM('web', 'whatsapp', 'phone', 'walk_in', 'admin'), 
    allowNull: false, 
    defaultValue: 'web' },
  notes: { 
    type: DataTypes.TEXT 
  },
  cancellation_reason: { 
    type: DataTypes.STRING(255) 
  },
  cancelled_at: { 
    type: DataTypes.DATE 
  },
  created_by: { 
    type: DataTypes.UUID 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'appointments',
  validate: {
    // La cita debe terminar después de empezar
    endAfterStart(this: Appointment) {
      if (this.end_at <= this.start_at) {
        throw new Error('La hora de fin de la cita debe ser mayor que la hora de inicio');
      }
    }
  }
});

export default Appointment;