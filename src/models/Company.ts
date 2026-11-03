// importamos las tecnologias que vamos a usar
import { 
    Model, // para crear modelos de datos
    DataTypes, // para definir los tipos de datos de cada campo
    InferAttributes, // para inferir los atributos de un modelo, infiere => define un atributo específico a partir de la definición del modelo
    InferCreationAttributes, // para inferir los atributos de creación de un modelo, inferir es decir, deducir automáticamente a partir de la definición del modelo
    CreationOptional // para definir campos que son opcionales al crear un registro
 } from 'sequelize';
 import db from '../config/db'; // importamos la conexión a la base de datos

// Definimos el modelo de datos para la tabla "companies"
class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
  declare id_company: CreationOptional<string>;           // id_company es opcional al crear un registro, se genera automáticamente (UUIDV4)
  declare name_company: string;                          // nombre de la empresa, obligatorio
  declare legal_name: string;                            // nombre legal de la empresa, obligatorio
  declare tax_id: string;                                // NIT
  declare slug: string;                                  // URL amigable
  declare email_company: string;
  declare phone_company: CreationOptional<string | null>; // teléfono de la empresa, opcional
  declare address_company: CreationOptional<string | null>;
  declare logo_url: CreationOptional<string | null>;
  declare timezone: CreationOptional<string>;            // por defecto America/Bogota
  declare currency_company: CreationOptional<string>;    // por defecto COP
  declare booking_slot_minutes: CreationOptional<number>;
  declare loyalty_enabled: CreationOptional<boolean>;    // programa de visitas
  declare status_company: CreationOptional<'active' | 'suspended' | 'inactive'>;
  declare delete_company: CreationOptional<boolean>;     // eliminación lógica
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


//  Definimos los campos de la tabla "companies" y sus tipos de datos, así como las restricciones y valores por defecto para la logica en ejecucion
Company.init(
  {
    id_company: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // genera un UUIDV4 automáticamente
        primaryKey: true,
    },
    name_company: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    legal_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    tax_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true, // el NIT debe ser único
    },
    slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true, // el slug debe ser único
    },
    email_company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // valida que sea un email válido
        },
    },
    phone_company: {
        type: DataTypes.STRING,
    },
    address_company: {
        type: DataTypes.STRING,
    },
    logo_url: {
        type: DataTypes.STRING(255),
    },
    timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'America/Bogota', // por defecto America/Bogota
    },
    currency_company: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'COP', // por defecto Colombian Peso
    },
    booking_slot_minutes: { // duración de cada cita en minutos
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30, // por defecto 30 minutos
    },
    loyalty_enabled: { // programa de promociones y recompensas por visitas
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // por defecto desactivado
    },
    status_company: {
        type: DataTypes.ENUM('active', 'suspended', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive', // por defecto inactivo
    },
    delete_company: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // por defecto no eliminado
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    sequelize: db, // la conexión a la base de datos
    tableName: 'companies', // nombre de la tabla en la base de datos
  }
);

// exportamos 
export default Company;