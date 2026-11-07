import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

class UserBankAccount extends Model<InferAttributes<UserBankAccount>, InferCreationAttributes<UserBankAccount>> {
    declare id_user_bank_account: CreationOptional<string>;
    declare company_id: string;
    declare user_id: string;
    declare bank_name: string;
    declare account_type: 'savings' | 'checking'; // Tipo de cuenta bancaria
    declare account_number: string; // Número de cuenta bancaria - debe de guardarse cifrado en la base de datos, para eso se puede usar un hook antes de guardar el registro
    declare account_holder_name: string; // Nombre del titular de la cuenta bancaria
    declare account_holder_document: string; // Documento del titular de la cuenta bancaria
    declare is_default: CreationOptional<boolean>; // Indica si esta cuenta bancaria es la predeterminada para el usuario
    declare status_bank_account: CreationOptional<'active' | 'inactive' | 'blocked'>; // Estado de la cuenta bancaria
    declare delete_bank_account: CreationOptional<boolean>; // Indica si la cuenta bancaria ha sido eliminada o no
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;    
};

// Modelo: CUENTAS BANCARIAS DEL USUARIO (donde se le consigna el pago al personal)
UserBankAccount.init({
    id_user_bank_account: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    bank_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    account_type: {
        type: DataTypes.ENUM('savings', 'checking'),
        allowNull: false
    },
    account_number: { // debe de guardarse cifrado en la base de datos, para eso se puede usar un hook antes de guardar el registro
        type: DataTypes.STRING(255),
        allowNull: false
    },
    account_holder_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    account_holder_document: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false, 
        defaultValue: false
    },
    status_bank_account: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    delete_bank_account: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },

},
    {
        sequelize: db,
        tableName: 'user_bank_accounts'
    }
);


export default UserBankAccount;