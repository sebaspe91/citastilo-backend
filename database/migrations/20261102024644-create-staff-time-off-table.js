'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: AUSENCIAS DEL PERSONAL (vacaciones, permisos, incapacidades)
  // Si está aprobada, el estilista NO aparece disponible en esas fechas
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('staff_time_off', {
      id_time_off: { // id de la ausencia
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
      approved_by: { // usuario que aprobó o rechazó -> auth
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      staff_id: { // estilista que se ausenta
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type_time_off: { // tipo: vacaciones, permiso, incapacidad, otro
        type: Sequelize.ENUM('vacation', 'permission', 'sick_leave', 'other'),
        allowNull: false
      },
      start_at: { // desde (fecha y hora)
        type: Sequelize.DATE,
        allowNull: false
      },
      end_at: { // hasta (fecha y hora)
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: { // motivo
        type: Sequelize.STRING(255)
      },
      status_time_off: { // estado: pendiente, aprobada, rechazada
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      approved_at: { // cuándo se aprobó o rechazó
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

    // Índice para buscar rápido las ausencias de un estilista por fechas
    await queryInterface.addIndex('staff_time_off', ['staff_id', 'start_at', 'end_at'], {
      name: 'idx_staff_time_off_staff_dates'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_time_off');
  }
};