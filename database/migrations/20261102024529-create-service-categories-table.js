'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: CATEGORÍAS DE SERVICIOS (Cortes, Barba, Uñas, Color...)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('service_categories', {
      id_service_category: { // id de la categoría
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa (cada una crea sus categorías)
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name_category: { // nombre: "Cortes", "Barba"...
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description_category: { // descripción
        type: Sequelize.STRING(255)
      },
      sort_order: { // orden en que se muestran
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status_category: { // estado: activa, inactiva
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_category: { // eliminación lógica
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

    // No se repite el nombre de la categoría dentro de la misma empresa
    await queryInterface.addIndex('service_categories', ['company_id', 'name_category'], {
      unique: true,
      name: 'uq_service_categories_company_name'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('service_categories');
  }
};