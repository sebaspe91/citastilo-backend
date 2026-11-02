'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: HORARIOS DEL PERSONAL (qué días y horas trabaja cada estilista)
  // Se pueden poner 2 filas el mismo día para dejar la hora de almuerzo:
  // lunes 08:00-12:00 y lunes 14:00-18:00
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('staff_schedules', {
      id_staff_schedule: { // id del horario
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
      day_of_week: { // día de la semana: 0 = domingo, 1 = lunes ... 6 = sábado
        type: Sequelize.TINYINT,
        allowNull: false
      },
      start_time: { // hora de entrada (solo hora, ej: 08:00)
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: { // hora de salida (ej: 18:00)
        type: Sequelize.TIME,
        allowNull: false
      },
      is_active: { // permite desactivar un horario sin borrarlo
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Índice para buscar rápido el horario de un estilista en un día
    await queryInterface.addIndex('staff_schedules', ['staff_id', 'day_of_week'], {
      name: 'idx_staff_schedules_staff_day'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_schedules');
  }
};