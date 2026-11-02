'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: CITAS (la cita agendada: quién, con quién, cuándo y cuánto cuesta)
  // No lleva eliminación lógica: una cita no se borra, se CANCELA con su estado
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id_appointment: { // id de la cita
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
      customer_id: { // cliente
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'customers', key: 'id_customer' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_by: { // usuario que la agendó (nulo si la agendó el cliente desde la web)
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      staff_id: { // estilista que atiende
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      promotion_id: { // promoción aplicada (opcional)
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'promotions', key: 'id_promotion' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_at: { // inicio de la cita (fecha y hora, en UTC)
        type: Sequelize.DATE,
        allowNull: false
      },
      end_at: { // fin de la cita (inicio + duración de los servicios)
        type: Sequelize.DATE,
        allowNull: false
      },
      status_appointment: { // estado de la cita: pendiente, confirmada, en curso, completada, cancelada, no asistió
        type: Sequelize.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
        allowNull: false,
        defaultValue: 'pending'
      },
      subtotal: { // suma de los servicios
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      discount_amount: { // descuento aplicado
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_amount: { // total a pagar = subtotal - descuento
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      payment_status: { // estado del pago: sin pagar, abono, pagada, reembolsada
        type: Sequelize.ENUM('unpaid', 'partial', 'paid', 'refunded'),
        allowNull: false,
        defaultValue: 'unpaid'
      },
      counted_for_promotion: { // true = esta cita ya sumó al contador del cliente (evita sumar doble)
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      source: { // por dónde se agendó: web, whatsapp, teléfono, llegó al local, admin
        type: Sequelize.ENUM('web', 'whatsapp', 'phone', 'walk_in', 'admin'),
        allowNull: false,
        defaultValue: 'web'
      },
      notes: { // notas de la cita
        type: Sequelize.TEXT
      },
      cancellation_reason: { // motivo de cancelación
        type: Sequelize.STRING(255)
      },
      cancelled_at: { // cuándo se canceló
        type: Sequelize.DATE
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

    // Índice para revisar rápido si el estilista ya tiene cita en ese horario
    await queryInterface.addIndex('appointments', ['staff_id', 'start_at'], {
      name: 'idx_appointments_staff_start'
    });
    // Índice para la agenda del día de la empresa
    await queryInterface.addIndex('appointments', ['company_id', 'start_at'], {
      name: 'idx_appointments_company_start'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('appointments');
  }
};