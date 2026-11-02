'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Crea la tabla 'modules': catálogo global de módulos del sistema (citas, servicios, clientes...)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('modules', {
      id_module: {
        allowNull: false, // NO acepta nulos
        type: Sequelize.UUID,
        primaryKey: true
      },
      name_module: { // nombre visible en el menú: "Citas", "Servicios", "Clientes"...
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code_module: { // código que usa el backend: 'appointments', 'services', 'customers'...
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true // no puede haber dos módulos con el mismo código
      },
      description_module: {
        type: Sequelize.STRING(255)
        },
        sort_order_module: { // posición en el menú: 1 aparece primero, 2 después...
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status_module: { // permite ocultar un módulo sin borrarlo
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
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

  // Revierte la migración: elimina la tabla 'modules'
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('modules');
  }
};
