import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: REGISTRO DE AUDITORÍA (quién hizo qué, cuándo y qué cambió)
// Solo tiene createdAt: un registro de auditoría nunca se modifica
class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
  declare id_audit_log: CreationOptional<string>;
  declare company_id: CreationOptional<string | null>;
  declare user_id: CreationOptional<string | null>;
  declare action_log: string;                                  // 'create', 'update', 'delete', 'login'...
  declare entity: string;                                      // tabla afectada: 'appointments'...
  declare entity_id: CreationOptional<string | null>;
  declare old_values: CreationOptional<Record<string, unknown> | null>;  // cómo estaba ANTES
  declare new_values: CreationOptional<Record<string, unknown> | null>;  // cómo quedó DESPUÉS
  declare ip_address: CreationOptional<string | null>;
  declare user_agent: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
}

// MariaDB guarda JSON como texto (LONGTEXT): al leerlo llega como string.
// Este getter lo convierte de vuelta a objeto.
const parseJson = (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : value);

AuditLog.init({
  id_audit_log: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID 
  },
  user_id: { 
    type: DataTypes.UUID 
  },
  action_log: { 
    type: DataTypes.STRING(30), 
    allowNull: false 
  },
  entity: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  entity_id: { 
    type: DataTypes.UUID 
  },
  old_values: {
    type: DataTypes.JSON,
    get() { return parseJson(this.getDataValue('old_values')); } // es para pasar de string a objeto al leerlo de la DB
  },
  new_values: {
    type: DataTypes.JSON,
    get() { return parseJson(this.getDataValue('new_values')); }
  },
  ip_address: { 
    type: DataTypes.STRING(45) 
  },
  user_agent: { 
    type: DataTypes.STRING(255) 
  },
  createdAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'audit_logs',
  updatedAt: false   // esta tabla NO tiene updatedAt
});

export default AuditLog;