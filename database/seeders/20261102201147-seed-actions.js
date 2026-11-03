'use strict';

// randomUUID viene incluido en Node: genera un UUID v4 (no hay que instalar nada)
const { randomUUID } = require('crypto');

// Catálogo de ACCIONES que se pueden hacer sobre cualquier módulo
const actions = [
  { code: 'create',  name: 'Crear',    description: 'Registrar nuevos datos' },
  { code: 'read',    name: 'Ver',      description: 'Consultar y listar datos' },
  { code: 'update',  name: 'Editar',   description: 'Modificar datos existentes' },
  { code: 'delete',  name: 'Eliminar', description: 'Eliminar datos (eliminación lógica)' },
  { code: 'export',  name: 'Exportar', description: 'Descargar en PDF o Excel' },
  { code: 'approve', name: 'Aprobar',  description: 'Aprobar o rechazar solicitudes (ej: ausencias del personal)' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Inserta las acciones. createdAt/updatedAt los llena MySQL (CURRENT_TIMESTAMP)
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('actions', actions.map((action) => ({
      id_action: randomUUID(),
      code_action: action.code,
      name_action: action.name,
      description_action: action.description
    })));
  },

  // Revierte: borra SOLO las acciones que insertó este seeder
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('actions', {
      code_action: actions.map((action) => action.code) // un array = WHERE code_action IN (...)
    });
  }
};