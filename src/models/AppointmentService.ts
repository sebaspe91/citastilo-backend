import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: SERVICIOS DE LA CITA (detalle: qué servicios incluye cada cita)
// price y duration_minutes se COPIAN del servicio al agendar
class AppointmentService extends Model<InferAttributes<AppointmentService>, InferCreationAttributes<AppointmentService>> {
  declare id_appointment_service: CreationOptional<string>;
  declare company_id: string;
  declare appointment_id: string;
  declare service_id: string;
  declare price: string;                 // DECIMAL como TEXTO (copiado al agendar)
  declare duration_minutes: number;      // copiado al agendar
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AppointmentService.init({
  id_appointment_service: { 
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
  service_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    validate: { min: 0 } 
},
  duration_minutes: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1 } 
},
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'appointment_services' });

export default AppointmentService;