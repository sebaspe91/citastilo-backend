'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: PAGOS AL PERSONAL (lo que la empresa le paga al estilista)
  // No lleva eliminación lógica: un pago no se borra, se cancela con su estado
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('staff_payouts', {
      id_staff_payout: { // id del pago
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa que paga
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_by: { // usuario que registró el pago - auth
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      staff_id: { // estilista que recibe el pago
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      bank_account_id: { // cuenta donde se consignó (nulo si fue en efectivo)
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'user_bank_accounts', key: 'id_bank_account' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: { // valor pagado (DECIMAL para dinero, nunca FLOAT)
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      currency: { // moneda
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'COP'
      },
      concept: { // concepto: "Quincena 1-15 noviembre", "Comisiones"...
        type: Sequelize.STRING(255),
        allowNull: false
      },
      period_start: { // inicio del periodo que se paga
        type: Sequelize.DATEONLY
      },
      period_end: { // fin del periodo que se paga
        type: Sequelize.DATEONLY
      },
      payout_date: { // fecha en que se hizo el pago
        type: Sequelize.DATE,
        allowNull: false
      },
      payment_method: { // método: transferencia, efectivo, otro
        type: Sequelize.ENUM('bank_transfer', 'cash', 'other'),
        allowNull: false
      },
      reference_number: { // número de comprobante de la transferencia
        type: Sequelize.STRING(100)
      },
      receipt_url: { // imagen o PDF del comprobante
        type: Sequelize.STRING(255)
      },
      status_payout: { // estado: pendiente, pagado, cancelado
        type: Sequelize.ENUM('pending', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_payouts');
  }
};