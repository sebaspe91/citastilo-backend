import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from 'sequelize';
import db from '../config/db'; // importamos la conexión a la base de datos

// Definimos el modelo de datos para la tabla "modules"
class Module extends Model<InferAttributes<Module>, InferCreationAttributes<Module>> {
    declare id_module: CreationOptional<string>;           // id_module es opcional al crear un registro, se genera automáticamente (UUIDV4)
    declare name_module: string;                          // nombre del módulo, obligatorio
    declare code_module: string;                            // código del módulo, obligatorio
    declare description_module: CreationOptional<string | null>; // descripción del módulo, opcional
    declare sort_order_module: CreationOptional<number>; // orden de aparición del módulo, opcional
    declare status_module: CreationOptional<'active' | 'inactive'>; // estado del módulo, por defecto 'active'
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

// Definimos los campos de la tabla "modules" y sus tipos de datos, así como las restricciones y valores por defecto para la logica en ejecucion
Module.init({
    id_module: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name_module: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    code_module: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    description_module: {
        type: DataTypes.STRING(255),
    },
    sort_order_module: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status_module: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: db,
    tableName: 'modules',
});

export default Module;