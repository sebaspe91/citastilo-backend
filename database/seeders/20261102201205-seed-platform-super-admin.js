'use strict';

const { randomUUID } = require('crypto'); // genera un UUID v4 (no hay que instalar nada)
const bcrypt = require('bcryptjs'); // encripta la contraseña del súper admin (bcryptjs es más rápido que bcrypt)

const PLATFORM_SLUG = 'citastilo'; // identifica la empresa plataforma (para el down)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Crea la EMPRESA PLATAFORMA "citaStilo", el ROL super_admin, el USUARIO súper admin
  // y le asigna TODOS los permisos (todos los módulos × todas las acciones)
  async up (queryInterface, Sequelize) {
    const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
    if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
      throw new Error('Faltan SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD en el .env');
    }

    const companyId = randomUUID();
    const roleId = randomUUID();

    // Transacción: o se guarda TODO, o no se guarda NADA
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Empresa plataforma
      await queryInterface.bulkInsert('companies', [{ // .bulkInsert() se ejecuta en una sola consulta SQL INSERT y recibe un array de objetos (aunque sea uno solo)
        id_company: companyId,
        name_company: 'citaStilo',
        legal_name: 'citaStilo',
        tax_id: '000000000-0',  // NIT de relleno: cámbialo si la registras legalmente
        slug: PLATFORM_SLUG,
        email_company: SEED_ADMIN_EMAIL
      }], { transaction });

      // 2. Rol súper admin (is_system = true: nadie lo puede editar ni borrar)
      await queryInterface.bulkInsert('roles', [{
        id_role: roleId,
        company_id: companyId,
        name_role: 'Súper administrador',
        code_role: 'super_admin',
        description_role: 'Dueño de la plataforma: administra todas las empresas',
        is_system: true
      }], { transaction });

      // 3. Usuario súper admin con la contraseña ENCRIPTADA
      await queryInterface.bulkInsert('users', [{
        id_user: randomUUID(),
        company_id: companyId,
        role_id: roleId,
        document_type: 'CC',
        document_number: '0000000000', // de relleno: lo actualizas desde la app
        first_name: 'Súper',
        last_name: 'Admin',
        email_user: SEED_ADMIN_EMAIL,
        password_user: await bcrypt.hash(SEED_ADMIN_PASSWORD, 10) // 10 = "costo" del encriptado
      }], { transaction });

      // 4. Todos los permisos: lee los módulos y acciones que crearon los seeders anteriores
      const modules = await queryInterface.sequelize.query(
        'SELECT id_module FROM modules',
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );
      const actions = await queryInterface.sequelize.query(
        'SELECT id_action FROM actions',
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      // Combina cada módulo con cada acción: 15 módulos × 6 acciones = 90 permisos
      // es un ciclo for anidado, pero con flatMap() queda más limpio y devuelve un solo array de permisos
      const permissions = modules.flatMap((module) => // flatMap() = map() + flatten() (un array de arrays lo aplana en un solo array)
        actions.map((action) => ({
          id_role_permission: randomUUID(),
          role_id: roleId,
          module_id: module.id_module,
          action_id: action.id_action
        }))
      );

      await queryInterface.bulkInsert('role_permissions', permissions, { transaction });
    });
  },

  // Revierte: borra en orden INVERSO (primero los hijos, luego el padre)
  // por las llaves foráneas: no se puede borrar un rol que todavía tiene permisos
  async down (queryInterface, Sequelize) {
    // Busca la empresa plataforma por su slug (no se puede borrar otra empresa)
    const [company] = await queryInterface.sequelize.query(
      'SELECT id_company FROM companies WHERE slug = ?',
      { replacements: [PLATFORM_SLUG], type: Sequelize.QueryTypes.SELECT }
    );
    if (!company) return; // no existe: no hay nada que borrar

    // Busca los roles de esa empresa para borrar sus permisos y usuarios
    const roles = await queryInterface.sequelize.query(
      'SELECT id_role FROM roles WHERE company_id = ?',
      { replacements: [company.id_company], type: Sequelize.QueryTypes.SELECT }
    );

    // Crea un array con los IDs de los roles para borrarlos en la tabla role_permissions
    const roleIds = roles.map((role) => role.id_role);

    // Transacción: o se borra TODO, o no se borra NADA
    await queryInterface.sequelize.transaction(async (transaction) => {
      if (roleIds.length > 0) {
        await queryInterface.bulkDelete('role_permissions', { role_id: roleIds }, { transaction }); // borra los permisos de esos roles
      }
      await queryInterface.bulkDelete('users', { company_id: company.id_company }, { transaction }); // borra los usuarios de esa empresa
      await queryInterface.bulkDelete('roles', { company_id: company.id_company }, { transaction }); // borra los roles de esa empresa
      await queryInterface.bulkDelete('companies', { id_company: company.id_company }, { transaction }); // borra la empresa plataforma
    });
  }
};