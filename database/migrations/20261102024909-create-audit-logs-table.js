'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: REGISTRO DE AUDITORÍA (quién hizo qué, cuándo y qué cambió)
  // Solo lleva createdAt: un registro de auditoría nunca se modifica
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id_audit_log: { // id del registro
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa (nulo si es una acción global del sistema)
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      user_id: { // usuario que hizo la acción
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action_log: { // acción: 'create', 'update', 'delete', 'login'...
        type: Sequelize.STRING(30),
        allowNull: false
      },
      entity: { // tabla afectada: 'appointments', 'services'...
        type: Sequelize.STRING(50),
        allowNull: false
      },
      entity_id: { // id del registro afectado
        type: Sequelize.UUID
      },
      old_values: { // cómo estaba ANTES del cambio
        type: Sequelize.JSON
      },
      new_values: { // cómo quedó DESPUÉS del cambio
        type: Sequelize.JSON
      },
      ip_address: { // IP desde donde se hizo (45 caracteres cubre IPv6)
        type: Sequelize.STRING(45)
      },
      user_agent: { // navegador o dispositivo
        type: Sequelize.STRING(255)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índice para ver el historial de un registro específico
    await queryInterface.addIndex('audit_logs', ['company_id', 'entity', 'entity_id'], {
      name: 'idx_audit_logs_company_entity'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  }
};