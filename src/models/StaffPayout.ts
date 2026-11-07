import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: PAGOS AL PERSONAL (lo que la empresa le paga al estilista)
// Sin eliminación lógica: un pago no se borra, se cancela con status_payout
class StaffPayout extends Model<InferAttributes<StaffPayout>, InferCreationAttributes<StaffPayout>> {
  declare id_staff_payout: CreationOptional<string>;
  declare company_id: string;
  declare staff_id: string;                                   // estilista que recibe el pago
  declare bank_account_id: CreationOptional<string | null>;   // nulo = pago en efectivo
  declare amount: string;                                     // DECIMAL llega como TEXTO: '150000.00'
  declare currency: CreationOptional<string>;
  declare concept: string;
  declare period_start: CreationOptional<string | null>;      // DATEONLY: '2026-11-01'
  declare period_end: CreationOptional<string | null>;
  declare payout_date: Date;
  declare payment_method: 'bank_transfer' | 'cash' | 'other';
  declare reference_number: CreationOptional<string | null>;
  declare receipt_url: CreationOptional<string | null>;
  declare status_payout: CreationOptional<'pending' | 'paid' | 'cancelled'>;
  declare created_by: string;                                 // usuario que registró el pago
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffPayout.init(
    {
        id_staff_payout: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        company_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        staff_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        bank_account_id: { 
            type: DataTypes.UUID 
        },
        amount: { 
            type: DataTypes.DECIMAL(15, 2), 
            allowNull: false, 
            validate: { min: 0 } 
        },
        currency: { 
            type: DataTypes.STRING(3), 
            allowNull: false, 
            defaultValue: 'COP' 
        },
        concept: { 
            type: DataTypes.STRING(255), 
            allowNull: false 
        },
        period_start: { 
            type: DataTypes.DATEONLY 
        },
        period_end: { 
            type: DataTypes.DATEONLY 
        },
        payout_date: { 
            type: DataTypes.DATE, 
            allowNull: false 
        },
        payment_method: { 
            type: DataTypes.ENUM('bank_transfer', 'cash', 'other'), 
            allowNull: false 
        },
        reference_number: { 
            type: DataTypes.STRING(100) 
        },
        receipt_url: { 
            type: DataTypes.STRING(255) 
        },
        status_payout: { 
            type: DataTypes.ENUM('pending', 'paid', 'cancelled'), 
            allowNull: false, 
            defaultValue: 'pending' 
        },
        created_by: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, 
    { 
        sequelize: db, 
        tableName: 'staff_payouts' 
    }
);

export default StaffPayout;