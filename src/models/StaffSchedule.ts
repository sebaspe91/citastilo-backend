import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: HORARIOS DEL PERSONAL (horario semanal que se repite)
class StaffSchedule extends Model<InferAttributes<StaffSchedule>, InferCreationAttributes<StaffSchedule>> {
  declare id_staff_schedule: CreationOptional<string>;
  declare company_id: string;
  declare staff_id: string;
  declare day_of_week: number;          // 0 = domingo ... 6 = sábado
  declare start_time: string;           // TIME llega como TEXTO: '08:00:00'
  declare end_time: string;
  declare is_active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffSchedule.init({
  id_staff_schedule: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  company_id: { type: DataTypes.UUID, allowNull: false },
  staff_id: { type: DataTypes.UUID, allowNull: false },
  day_of_week: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 0, max: 6 } },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'staff_schedules',
  // Validación de TODO el registro: compara dos campos entre sí
  validate: {
    endAfterStart(this: StaffSchedule) {
      if (this.end_time <= this.start_time) {
        throw new Error('La hora de salida debe ser mayor que la hora de entrada');
      }
    }
  }
});

export default StaffSchedule;