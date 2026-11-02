'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: CUENTAS BANCARIAS DEL USUARIO (donde se le consigna el pago al personal)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_bank_accounts', {
      id_bank_account: { // id de la cuenta bancaria
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
      user_id: { // dueño de la cuenta
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      bank_name: { // nombre del banco: Bancolombia, Davivienda, Nequi...
        type: Sequelize.STRING(100),
        allowNull: false
      },
      account_type: { // tipo de cuenta: ahorros, corriente
        type: Sequelize.ENUM('savings', 'checking'),
        allowNull: false
      },
      account_number: { // número de cuenta (se guarda ENCRIPTADO, por eso es largo)
        type: Sequelize.STRING(255),
        allowNull: false
      },
      account_holder_name: { // nombre del titular
        type: Sequelize.STRING(150),
        allowNull: false
      },
      account_holder_document: { // documento del titular
        type: Sequelize.STRING(20),
        allowNull: false
      },
      is_default: { // cuenta principal para los pagos
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status_bank_account: { // estado: activa, inactiva
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_bank_account: { // eliminación lógica
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
    await queryInterface.dropTable('user_bank_accounts');
  }
};