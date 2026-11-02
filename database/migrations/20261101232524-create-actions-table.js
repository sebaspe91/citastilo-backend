'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Crea la tabla 'actions': catálogo global de acciones (create, read, update, delete...)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('actions', {
      id_action: {
        allowNull: false, // NO acepta nulos
        type: Sequelize.UUID,
        primaryKey: true
      },
      name_action: { // nombre visible: "Crear", "Ver", "Editar"...
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code_action: { // código que usa el backend: 'create', 'read', 'update'...
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true // no puede haber dos acciones con el mismo código
      },
      description_action: {
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

  // Revierte la migración: elimina la tabla 'actions'
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('actions');
  }
};
