import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: SERVICIOS DEL PERSONAL (qué servicios sabe hacer cada estilista)
class StaffService extends Model<InferAttributes<StaffService>, InferCreationAttributes<StaffService>> {
  declare id_staff_service: CreationOptional<string>;
  declare company_id: string;
  declare staff_id: string;
  declare service_id: string;
  declare custom_price: CreationOptional<string | null>;            // nulo = usa price_service
  declare custom_duration_minutes: CreationOptional<number | null>; // nulo = usa duration_minutes_service
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffService.init({
  id_staff_service: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  company_id: { type: DataTypes.UUID, allowNull: false },
  staff_id: { type: DataTypes.UUID, allowNull: false },
  service_id: { type: DataTypes.UUID, allowNull: false },
  custom_price: { type: DataTypes.DECIMAL(12, 2), validate: { min: 0 } },
  custom_duration_minutes: { type: DataTypes.INTEGER, validate: { min: 1 } },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, { sequelize: db, tableName: 'staff_services' });

export default StaffService;