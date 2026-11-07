import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: AUSENCIAS DEL PERSONAL (vacaciones, permisos, incapacidades)
class StaffTimeOff extends Model<InferAttributes<StaffTimeOff>, InferCreationAttributes<StaffTimeOff>> {
  declare id_time_off: CreationOptional<string>;
  declare company_id: string;
  declare staff_id: string;
  declare type_time_off: 'vacation' | 'permission' | 'sick_leave' | 'other';
  declare start_at: Date;
  declare end_at: Date;
  declare reason: CreationOptional<string | null>;
  declare status_time_off: CreationOptional<'pending' | 'approved' | 'rejected'>;
  declare approved_by: CreationOptional<string | null>;   // quién aprobó o rechazó
  declare approved_at: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffTimeOff.init({
  id_time_off: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  company_id: { type: DataTypes.UUID, allowNull: false },
  staff_id: { type: DataTypes.UUID, allowNull: false },
  type_time_off: { type: DataTypes.ENUM('vacation', 'permission', 'sick_leave', 'other'), allowNull: false },
  start_at: { type: DataTypes.DATE, allowNull: false },
  end_at: { type: DataTypes.DATE, allowNull: false },
  reason: { type: DataTypes.STRING(255) },
  status_time_off: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  approved_by: { type: DataTypes.UUID },
  approved_at: { type: DataTypes.DATE },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'staff_time_off',
  // Validación de TODO el registro: la ausencia debe terminar después de empezar
  validate: {
    endAfterStart(this: StaffTimeOff) {
      if (this.end_at <= this.start_at) {
        throw new Error('La fecha de fin debe ser mayor que la fecha de inicio');
      }
    }
  }
});

export default StaffTimeOff;