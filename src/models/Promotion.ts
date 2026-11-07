import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db';

// Modelo: PROMOCIONES (descuentos normales y premios por visitas)
// required_visits = NULL → promoción normal | required_visits = 10 → premio por visitas
class Promotion extends Model<InferAttributes<Promotion>, InferCreationAttributes<Promotion>> {
  declare id_promotion: CreationOptional<string>;
  declare company_id: string;
  declare name_promotion: string;
  declare description_promotion: CreationOptional<string | null>;
  declare code_promotion: CreationOptional<string | null>;    // cupón opcional: "PAPA20"
  declare discount_type: 'percentage' | 'fixed';
  declare discount_value: string;                             // DECIMAL como TEXTO: '20.00'
  declare min_amount: CreationOptional<string | null>;
  declare required_visits: CreationOptional<number | null>;
  declare reward_valid_days: CreationOptional<number | null>;
  declare start_date: string;                                 // DATEONLY: '2026-11-01'
  declare end_date: CreationOptional<string | null>;
  declare max_uses: CreationOptional<number | null>;
  declare uses_count: CreationOptional<number>;
  declare status_promotion: CreationOptional<'active' | 'inactive'>;
  declare delete_promotion: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Promotion.init({
  id_promotion: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  company_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  name_promotion: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  description_promotion: { 
    type: DataTypes.STRING(255) 
  },
  code_promotion: { 
    type: DataTypes.STRING(30) 
  },
  discount_type: { 
    type: DataTypes.ENUM('percentage', 'fixed'), 
    allowNull: false 
  },
  discount_value: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false, 
    validate: { min: 0 } 
},
  min_amount: { 
    type: DataTypes.DECIMAL(12, 2), 
    validate: { min: 0 } 
},
  required_visits: { 
    type: DataTypes.INTEGER, 
    validate: { min: 1 } 
},
  reward_valid_days: { 
    type: DataTypes.INTEGER, 
    validate: { min: 1 } 
},
  start_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  end_date: { 
    type: DataTypes.DATEONLY 
  },
  max_uses: { 
    type: DataTypes.INTEGER, 
    validate: { min: 1 } 
},
  uses_count: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0 
  },
  status_promotion: { 
    type: DataTypes.ENUM('active', 'inactive'), 
    allowNull: false, 
    defaultValue: 'active' 
  },
  delete_promotion: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: db,
  tableName: 'promotions',
  validate: {
    // Un porcentaje no puede pasar de 100% (100 = servicio gratis)
    percentageMax100(this: Promotion) {
      if (this.discount_type === 'percentage' && Number(this.discount_value) > 100) { // convertir a número para comparar
        throw new Error('El descuento en porcentaje no puede ser mayor a 100');
      }
    },
    // Si tiene fecha de fin, debe ser igual o posterior a la de inicio
    endAfterStart(this: Promotion) {
      if (this.end_date && this.end_date < this.start_date) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }
    }
  }
});

export default Promotion;
