'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Tabla: USUARIOS (personal de la empresa: admin, estilistas, recepcionistas)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id_user: { // id del usuario
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      company_id: { // empresa a la que pertenece
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id_company' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      role_id: { // rol del usuario (admin, estilista...)
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id_role' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      document_type: { // tipo de documento: cédula, cédula extranjería, tarjeta identidad, pasaporte
        type: Sequelize.ENUM('CC', 'CE', 'TI', 'PP'),
        allowNull: false,
        defaultValue: 'CC'
      },
      document_number: { // número de documento
        type: Sequelize.STRING(20),
        allowNull: false
      },
      first_name: { // nombres
        type: Sequelize.STRING(80),
        allowNull: false
      },
      last_name: { // apellidos
        type: Sequelize.STRING(80),
        allowNull: false
      },
      email_user: { // correo (sirve para iniciar sesión)
        type: Sequelize.STRING(150),
        allowNull: false
      },
      password_user: { // contraseña encriptada con bcrypt (nunca en texto plano)
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone_user: { // teléfono
        type: Sequelize.STRING(20)
      },
      address_user: { // dirección
        type: Sequelize.STRING(200)
      },
      city: { // ciudad
        type: Sequelize.STRING(80)
      },
      birth_date: { // fecha de nacimiento (solo fecha, sin hora)
        type: Sequelize.DATEONLY
      },
      avatar_url: { // foto de perfil
        type: Sequelize.STRING(255)
      },
      token_user: { // token para confirmar cuenta o recuperar contraseña
        type: Sequelize.STRING(255)
      },
      status_user: { // estado: activo, inactivo, bloqueado
        type: Sequelize.ENUM('active', 'inactive', 'blocked'),
        allowNull: false,
        defaultValue: 'active'
      },
      last_login_at: { // último inicio de sesión
        type: Sequelize.DATE
      },
      delete_user: { // eliminación lógica
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

    // El correo no se repite dentro de la misma empresa
    await queryInterface.addIndex('users', ['company_id', 'email_user'], {
      unique: true,
      name: 'uq_users_company_email'
    });
    // El documento no se repite dentro de la misma empresa
    await queryInterface.addIndex('users', ['company_id', 'document_type', 'document_number'], {
      unique: true,
      name: 'uq_users_company_document'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
