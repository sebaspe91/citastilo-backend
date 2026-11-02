'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id_role_permission: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id_role'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      module_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id_module'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      action_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'actions',
          key: 'id_action'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    // Permite que la combinación de role_id, module_id y action_id sea única
    await queryInterface.addIndex('role_permissions', ['role_id', 'module_id', 'action_id'], {
      unique: true,
      name: 'uq_role_permissions_role_module_action' // Nombre del índice
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
