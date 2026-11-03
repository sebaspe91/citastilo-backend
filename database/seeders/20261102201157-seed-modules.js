'use strict';

const { randomUUID } = require('crypto');

// Catálogo de MÓDULOS del sistema (ítems del menú). sort = orden en el menú
const modules = [
  { code: 'dashboard',          name: 'Inicio',                 sort: 1,  description: 'Resumen del día' },
  { code: 'appointments',       name: 'Citas',                  sort: 2,  description: 'Agenda y citas' },
  { code: 'customers',          name: 'Clientes',               sort: 3,  description: 'Clientes de la empresa' },
  { code: 'services',           name: 'Servicios',              sort: 4,  description: 'Servicios y precios' },
  { code: 'service_categories', name: 'Categorías de servicios', sort: 5,  description: 'Agrupación de servicios' },
  { code: 'promotions',         name: 'Promociones',            sort: 6,  description: 'Descuentos y programa de visitas' },
  { code: 'staff_schedules',    name: 'Horarios',               sort: 7,  description: 'Horarios del personal' },
  { code: 'staff_time_off',     name: 'Ausencias',              sort: 8,  description: 'Vacaciones, permisos e incapacidades' },
  { code: 'payments',           name: 'Pagos de citas',         sort: 9,  description: 'Pagos de los clientes' },
  { code: 'staff_payouts',      name: 'Pagos al personal',      sort: 10, description: 'Pagos a estilistas' },
  { code: 'users',              name: 'Usuarios',               sort: 11, description: 'Personal de la empresa' },
  { code: 'roles',              name: 'Roles y permisos',       sort: 12, description: 'Roles y lo que puede hacer cada uno' },
  { code: 'reports',            name: 'Reportes',               sort: 13, description: 'Reportes e informes' },
  { code: 'audit_logs',         name: 'Auditoría',              sort: 14, description: 'Historial de cambios' },
  { code: 'companies',          name: 'Empresas',               sort: 15, description: 'Empresas de la plataforma (solo súper admin)' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('modules', modules.map((module) => ({
      id_module: randomUUID(),
      code_module: module.code,
      name_module: module.name,
      description_module: module.description,
      sort_order_module: module.sort
    })));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('modules', {
      code_module: modules.map((module) => module.code)
    });
  }
};
