'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: CLIENTES (las personas que agendan citas)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id_customer: { // id del cliente
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa (cada empresa tiene sus clientes)
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      first_name: { // nombres
        type: Sequelize.STRING(80),
        allowNull: false
      },
      last_name: { // apellidos
        type: Sequelize.STRING(80)
      },
      document_type: { // tipo de documento (opcional)
        type: Sequelize.ENUM('CC', 'CE', 'TI', 'PP')
      },
      document_number: { // número de documento (opcional)
        type: Sequelize.STRING(20)
      },
      email_customer: { // correo
        type: Sequelize.STRING(150)
      },
      phone_customer: { // celular (obligatorio: para confirmar la cita por WhatsApp)
        type: Sequelize.STRING(20),
        allowNull: false
      },
      birth_date: { // cumpleaños (para enviarle promociones)
        type: Sequelize.DATEONLY
      },
      notes: { // notas: "alérgico al tinte", "prefiere corte bajo"...
        type: Sequelize.TEXT
      },
      promotion_counter: { // contador de citas COMPLETADAS y PAGADAS (vuelve a 0 al usar la promoción)
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      has_promotion: { // true = tiene una promoción ganada SIN usar; false = no tiene o ya la usó
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status_customer: { // estado: activo, inactivo, bloqueado
        type: Sequelize.ENUM('active', 'inactive', 'blocked'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_customer: { // eliminación lógica
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

    // Índice NORMAL (no único) para buscar rápido por celular.
    // Varios clientes pueden compartir número: padre e hijo, pareja, número reciclado
    await queryInterface.addIndex('customers', ['company_id', 'phone_customer'], {
      name: 'idx_customers_company_phone'
    });

    // El documento SÍ es único por persona dentro de la empresa.
    // Como es opcional, MySQL permite varios clientes con documento vacío (NULL)
    await queryInterface.addIndex('customers', ['company_id', 'document_type', 'document_number'], {
      unique: true,
      name: 'uq_customers_company_document'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};