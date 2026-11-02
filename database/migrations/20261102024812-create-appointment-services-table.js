'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: SERVICIOS DE LA CITA (detalle: qué servicios incluye cada cita)
  // El precio y la duración se COPIAN al agendar: si mañana sube el precio
  // del servicio, las citas viejas conservan el precio que tenían
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('appointment_services', {
      id_appointment_service: { // id del detalle
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
      appointment_id: { // cita a la que pertenece
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'appointments', key: 'id_appointment' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_id: { // servicio
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'services', key: 'id_service' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      price: { // precio cobrado (copiado del servicio al momento de agendar)
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      duration_minutes: { // duración (copiada del servicio al momento de agendar)
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('appointment_services');
  }
};