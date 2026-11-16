import Company from '../models/Company';
import Module from '../models/Module';
import Action from '../models/Action';
import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import User from '../models/User';
import UserBankAccount from '../models/UserBankAccount';
import StaffPayout from '../models/StaffPayout';
import ServiceCategory from '../models/ServiceCategory';
import Service from '../models/Service';
import StaffService from '../models/StaffService';
import StaffSchedule from '../models/StaffSchedule';
import StaffTimeOff from '../models/StaffTimeOff';
import Customer from '../models/Customer';
import Promotion from '../models/Promotion';
import CustomerPromotion from '../models/CustomerPromotion';
import Appointment from '../models/Appointment';
import AppointmentService from '../models/AppointmentService';
import AppointmentPayment from '../models/AppointmentPayment';
import AuditLog from '../models/AuditLog';

// ============================================================
// GRUPO 1: EMPRESA Y SEGURIDAD
// ============================================================

// Empresa - Roles / Usuarios
Role.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Role, { foreignKey: 'company_id', as: 'roles' });

User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });

// Rol - Usuarios
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// Permisos: une Rol + Módulo + Acción
RolePermission.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(RolePermission, { foreignKey: 'role_id', as: 'permissions' });

RolePermission.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });
Module.hasMany(RolePermission, { foreignKey: 'module_id', as: 'permissions' });

RolePermission.belongsTo(Action, { foreignKey: 'action_id', as: 'action' });
Action.hasMany(RolePermission, { foreignKey: 'action_id', as: 'permissions' });

// ============================================================
// GRUPO 2: PERSONAL Y SERVICIOS
// ============================================================

// Usuario - Cuentas bancarias
UserBankAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(UserBankAccount, { foreignKey: 'user_id', as: 'bank_accounts' });

// Pagos al personal: a quién, a qué cuenta y quién lo registró
StaffPayout.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });
User.hasMany(StaffPayout, { foreignKey: 'staff_id', as: 'payouts' });

StaffPayout.belongsTo(UserBankAccount, { foreignKey: 'bank_account_id', as: 'bank_account' });
UserBankAccount.hasMany(StaffPayout, { foreignKey: 'bank_account_id', as: 'payouts' });

StaffPayout.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Empresa - Categorías / Servicios
ServiceCategory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(ServiceCategory, { foreignKey: 'company_id', as: 'service_categories' });

Service.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Service, { foreignKey: 'company_id', as: 'services' });

// Categoría - Servicios
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });
ServiceCategory.hasMany(Service, { foreignKey: 'category_id', as: 'services' });

// Estilista <-> Servicios que sabe hacer (tabla intermedia staff_services)
StaffService.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });
User.hasMany(StaffService, { foreignKey: 'staff_id', as: 'staff_services' });

StaffService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Service.hasMany(StaffService, { foreignKey: 'service_id', as: 'staff_services' });

// Atajo muchos a muchos: user.services / service.staff
User.belongsToMany(Service, { through: StaffService, foreignKey: 'staff_id', otherKey: 'service_id', as: 'services' });
Service.belongsToMany(User, { through: StaffService, foreignKey: 'service_id', otherKey: 'staff_id', as: 'staff' });

// Estilista - Horarios / Ausencias
StaffSchedule.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });
User.hasMany(StaffSchedule, { foreignKey: 'staff_id', as: 'schedules' });

StaffTimeOff.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });
User.hasMany(StaffTimeOff, { foreignKey: 'staff_id', as: 'time_off' });

StaffTimeOff.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// ============================================================
// GRUPO 3: CLIENTES Y CITAS
// ============================================================

// Empresa - Clientes / Promociones / Citas
Customer.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Customer, { foreignKey: 'company_id', as: 'customers' });

Promotion.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Promotion, { foreignKey: 'company_id', as: 'promotions' });

Appointment.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Company.hasMany(Appointment, { foreignKey: 'company_id', as: 'appointments' });

// Cliente <-> Promociones ganadas (tabla intermedia customer_promotions)
CustomerPromotion.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(CustomerPromotion, { foreignKey: 'customer_id', as: 'customer_promotions' });

CustomerPromotion.belongsTo(Promotion, { foreignKey: 'promotion_id', as: 'promotion' });
Promotion.hasMany(CustomerPromotion, { foreignKey: 'promotion_id', as: 'customer_promotions' });

// Cita: cliente, estilista, promoción aplicada y quién la agendó
Appointment.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Appointment, { foreignKey: 'customer_id', as: 'appointments' });

Appointment.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });
User.hasMany(Appointment, { foreignKey: 'staff_id', as: 'appointments' });

Appointment.belongsTo(Promotion, { foreignKey: 'promotion_id', as: 'promotion' });
Promotion.hasMany(Appointment, { foreignKey: 'promotion_id', as: 'appointments' });

Appointment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Cita <-> Servicios (tabla intermedia appointment_services, con precio copiado)
AppointmentService.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Appointment.hasMany(AppointmentService, { foreignKey: 'appointment_id', as: 'appointment_services' });

AppointmentService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Service.hasMany(AppointmentService, { foreignKey: 'service_id', as: 'appointment_services' });

// Cita - Pagos del cliente
AppointmentPayment.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Appointment.hasMany(AppointmentPayment, { foreignKey: 'appointment_id', as: 'payments' });

AppointmentPayment.belongsTo(User, { foreignKey: 'received_by', as: 'receiver' });

// Auditoría: empresa y usuario que hizo la acción
AuditLog.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ============================================================
// EXPORTAR
// ============================================================
export {
  Company, 
  Module, 
  Action, 
  Role, 
  RolePermission, 
  User,
  UserBankAccount, 
  StaffPayout, 
  ServiceCategory, 
  Service, 
  StaffService, 
  StaffSchedule, 
  StaffTimeOff,
  Customer, 
  Promotion, 
  CustomerPromotion, 
  Appointment, 
  AppointmentService, 
  AppointmentPayment, 
  AuditLog
};