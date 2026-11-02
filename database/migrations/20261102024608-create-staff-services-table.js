'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: SERVICIOS DEL PERSONAL (qué servicios sabe hacer cada estilista)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('staff_services', {
      id_staff_service: { // id del registro
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
      staff_id: { // estilista
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_id: { // servicio que hace
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'services', key: 'id_service' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      custom_price: { // precio especial de este estilista (nulo = usa el precio del servicio)
        type: Sequelize.DECIMAL(12, 2)
      },
      custom_duration_minutes: { // duración especial (nulo = usa la del servicio)
        type: Sequelize.INTEGER
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

    // Un estilista no puede tener el mismo servicio dos veces
    await queryInterface.addIndex('staff_services', ['staff_id', 'service_id'], {
      unique: true,
      name: 'uq_staff_services_staff_service'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_services');
  }
};
