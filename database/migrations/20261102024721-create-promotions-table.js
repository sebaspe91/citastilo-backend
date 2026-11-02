'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: PROMOCIONES (descuentos que se aplican a las citas)
  // Hay dos clases:
  //  - Normal: "20% en noviembre"        → required_visits = NULL
  //  - Por visitas: "10 visitas = premio" → required_visits = 10
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('promotions', {
      id_promotion: { // id de la promoción
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name_promotion: { // nombre: "2x1 en cortes", "10 visitas = corte gratis"...
        type: Sequelize.STRING(150),
        allowNull: false
      },
      description_promotion: { // descripción
        type: Sequelize.STRING(255)
      },
      code_promotion: { // código de cupón opcional: "PAPA20"
        type: Sequelize.STRING(30)
      },
      discount_type: { // tipo de descuento: porcentaje o valor fijo
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false
      },
      discount_value: { // valor: 20 (= 20%), 100 (= gratis) o 10000 (= $10.000)
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      min_amount: { // compra mínima para aplicarla (opcional)
        type: Sequelize.DECIMAL(12, 2)
      },
      required_visits: { // visitas completadas y pagadas para ganar el premio (nulo = promoción normal)
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reward_valid_days: { // días que tiene el cliente para usar el premio ganado (nulo = no vence)
        type: Sequelize.INTEGER,
        allowNull: true
      },
      start_date: { // fecha de inicio
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: { // fecha de fin (nulo = sin fecha de fin, útil para la promoción por visitas)
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      max_uses: { // cuántas veces se puede usar en total (nulo = ilimitado)
        type: Sequelize.INTEGER
      },
      uses_count: { // cuántas veces se ha usado
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status_promotion: { // estado: activa, inactiva
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_promotion: { // eliminación lógica
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // El código de cupón no se repite dentro de la misma empresa
    await queryInterface.addIndex('promotions', ['company_id', 'code_promotion'], {
      unique: true,
      name: 'uq_promotions_company_code'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('promotions');
  }
};