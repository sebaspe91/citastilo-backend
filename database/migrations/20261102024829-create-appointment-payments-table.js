'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: PAGOS DE LA CITA (lo que el CLIENTE paga; puede pagar en varios abonos)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('appointment_payments', {
      id_appointment_payment: { // id del pago
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
      appointment_id: { // cita que se paga
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'appointments', key: 'id_appointment' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      received_by: { // usuario que recibió el pago
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount: { // valor pagado
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      payment_method: { // método: efectivo, tarjeta, transferencia, Nequi, Daviplata, otro
        type: Sequelize.ENUM('cash', 'card', 'transfer', 'nequi', 'daviplata', 'other'),
        allowNull: false
      },
      reference_number: { // número de comprobante
        type: Sequelize.STRING(100)
      },
      paid_at: { // fecha y hora del pago
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status_payment: { // estado: completado, reembolsado, anulado
        type: Sequelize.ENUM('completed', 'refunded', 'voided'),
        allowNull: false,
        defaultValue: 'completed'
      },
      notes: { // notas
        type: Sequelize.STRING(255)
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
    await queryInterface.dropTable('appointment_payments');
  }
};