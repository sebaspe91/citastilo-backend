'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: PROMOCIONES DEL CLIENTE (premios o promociones asignadas a un cliente específico)
  // Ej: "Juan completó 10 visitas → ganó un corte gratis, vence el 15 de enero"
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_promotions', {
      id_customer_promotion: { // id del registro
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
      customer_id: { // cliente que recibe la promoción
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'customers', key: 'id_customer' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      promotion_id: { // promoción asignada
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'promotions', key: 'id_promotion' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status_customer_promotion: { // estado: disponible, usada, vencida
        type: Sequelize.ENUM('available', 'used', 'expired'),
        allowNull: false,
        defaultValue: 'available'
      },
      assigned_at: { // cuándo la ganó o se le asignó
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expires_at: { // vence el: assigned_at + reward_valid_days = dias que tiene el cliente para usar el premio esta ne la tabala promotions (nulo = no vence)
        type: Sequelize.DATE,
        allowNull: true
      },
      used_at: { // cuándo la usó
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

    // Índice para la tarea nocturna: buscar rápido los premios disponibles que ya vencieron
    await queryInterface.addIndex('customer_promotions', ['status_customer_promotion', 'expires_at'], {
      name: 'idx_customer_promotions_status_expires'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_promotions');
  }
};
