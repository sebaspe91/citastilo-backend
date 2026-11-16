import { Request, Response, NextFunction } from 'express';

// Middleware de PERMISOS: se usa DESPUÉS de checkAuth
// Ejemplo: requirePermission('appointments', 'create')
const requirePermission = (module: string, action: string) => { // primera funcion recibe solo (modulos y permisos)
  return (req: Request, res: Response, next: NextFunction) => { // Esta segunda funcion recibe (req, res, next) => retorna un middleware
    if (!req.user) { // no hay datos de usarios
      return res.status(401).json({ msg: 'No autenticado' }); // no sabe quien es
    }

    if (!req.user.permissions.includes(`${module}:${action}`)) { // no tiene permisos
      return res.status(403).json({ msg: 'No tienes permiso para realizar esta acción' }); // sabe quien es pero no tiene el permiso
    }

    return next();
  };
};

export default requirePermission;