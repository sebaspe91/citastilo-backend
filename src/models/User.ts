import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcryptjs';
import db from '../config/db';

// Modelo: USUARIOS (personal de la empresa: admin, estilistas, recepcionistas)
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id_user: CreationOptional<string>;
  declare company_id: string;
  declare role_id: string;
  declare document_type: CreationOptional<'CC' | 'CE' | 'TI' | 'PP'>;
  declare document_number: string;
  declare first_name: string;
  declare last_name: string;
  declare email_user: string;
  declare password_user: string;
  declare phone_user: CreationOptional<string | null>;
  declare address_user: CreationOptional<string | null>;
  declare city: CreationOptional<string | null>;
  declare birth_date: CreationOptional<string | null>;   // DATEONLY llega como texto: '1995-08-20'
  declare avatar_url: CreationOptional<string | null>;
  declare token_user: CreationOptional<string | null>;
  declare status_user: CreationOptional<'active' | 'inactive' | 'blocked'>;
  declare last_login_at: CreationOptional<Date | null>;
  declare delete_user: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Método propio: compara la contraseña escrita con el hash guardado (se usa en el login)
  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_user);
  }
}

User.init({
  id_user: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  role_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  document_type: { 
    type: DataTypes.ENUM('CC', 'CE', 'TI', 'PP'), 
    allowNull: false, 
    defaultValue: 'CC' 
  },
  document_number: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  first_name: { 
    type: DataTypes.STRING(80), 
    allowNull: false 
  },
  last_name: { 
    type: DataTypes.STRING(80), 
    allowNull: false 
  },
  email_user: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    validate: { isEmail: true } 
},
  password_user: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  phone_user: { 
    type: DataTypes.STRING(20) 
  },
  address_user: { 
    type: DataTypes.STRING(200) 
  },
  city: { 
    type: DataTypes.STRING(80) },
  birth_date: { 
    type: DataTypes.DATEONLY 
  },
  avatar_url: { 
    type: DataTypes.STRING(255) 
  },
  token_user: { 
    type: DataTypes.STRING(255) 
  },
  status_user: { 
    type: DataTypes.ENUM('active', 'inactive', 'blocked'), 
    allowNull: false, 
    defaultValue: 'active' 
  },
  last_login_at: { 
    type: DataTypes.DATE 
  },
  delete_user: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'users',

  // Por defecto NUNCA se devuelve la contraseña ni el token (aunque olvides excluirlos)
  defaultScope: {
    attributes: { exclude: ['password_user', 'token_user'] }
  },
  // Para el login sí se necesita: User.scope('withPassword').findOne(...)
  scopes: {
    withPassword: { attributes: { include: ['password_user', 'token_user'] } }
  },

  hooks: {
    // Antes de guardar (crear O actualizar): si la contraseña cambió, se encripta
    beforeSave: async (user) => {
      if (user.changed('password_user')) {
        user.password_user = await bcrypt.hash(user.password_user, 10);
      }
    }
  }
});

export default User;