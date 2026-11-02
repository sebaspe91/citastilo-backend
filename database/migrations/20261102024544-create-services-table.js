'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: SERVICIOS (Corte clásico, Barba, Tinte...)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id_service: { // id del servicio
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
      category_id: { // categoría a la que pertenece
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'service_categories', key: 'id_service_category' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name_service: { // nombre del servicio
        type: Sequelize.STRING(150),
        allowNull: false
      },
      description_service: { // descripción
        type: Sequelize.TEXT
      },
      price_service: { // precio base
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      duration_minutes_service: { // duración en minutos
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image_url_service: { // imagen del servicio
        type: Sequelize.STRING(255)
      },
      status_service: { // estado: activo, inactivo
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_service: { // eliminación lógica
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('services');
  }
};
