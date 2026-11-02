'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id_role: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id_company'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name_role: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code_role: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      description_role: {
        type: Sequelize.STRING(255)
      },
      is_system: { // true = rol creado por el sistema (admin, super_admin): NO se puede editar ni borrar
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status_role: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      delete_role: { // estado de eliminacion logica con update
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

    // Permite que el valor de code_role sea único dentro de la misma empresa (company_id)
    // Agregamos un índice único para la combinación de company_id y code_role
    await queryInterface.addIndex('roles', ['company_id', 'code_role'], {
      unique: true, // Esto asegura que no haya duplicados para la misma empresa y código de rol
      name: 'unique_company_code_role' // Nombre del índice 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
