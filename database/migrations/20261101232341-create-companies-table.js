'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Para crear la tabla 'companies' con sus respectivas columnas y restricciones
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id_company: {
        allowNull: false, // NO acepta valores nulos
        type: Sequelize.UUID, // tipo de dato UUID
        primaryKey: true
      },
      name_company: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      legal_name: { // razon social
        type: Sequelize.STRING(200),
        allowNull: false
      },
      tax_id: { // NIT
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      slug: { // URL amigable para empresas individuales
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      email_company: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_company: {
        type: Sequelize.STRING
      },
      address_company: { // direccion de la empresa
        type: Sequelize.STRING
      },
      logo_url: { 
        type: Sequelize.STRING(255) 
      },
      timezone: { // zona horaria
        type: Sequelize.STRING(50), 
        allowNull: false, 
        defaultValue: 'America/Bogota' 
      },
      currency_company: { // moneda
        type: Sequelize.STRING(3), 
        allowNull: false, 
        defaultValue: 'COP' // peso colombiano
      },
      booking_slot_minutes: { // duracion de la cita en minutos
        type: Sequelize.INTEGER, 
        allowNull: false, 
        defaultValue: 15 
      },
      loyalty_enabled: { // programa de visitas (contador de promociones): true = activo, false = la empresa no lo usa
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status_company: { // estado de la empresa
        type: Sequelize.ENUM('active', 'suspended', 'inactive'), // activo, suspendido, inactivo
        allowNull: false,
        defaultValue: 'active',
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
      },
      delete_company: { // estado de eliminacion logica con update
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },

  // Para revertir la migración y eliminar la tabla 'companies'
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('companies');
  }
};