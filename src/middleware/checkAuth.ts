import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'; // para saber los errores del token
import { verifyJWT } from '../helpers/jwt';
import { User, Role, RolePermission, Module, Action, Company } from '../associations';

// Middleware para las rutas PRIVADAS: solo pasa quien trae un token válido
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization; // aca va el token enviado desde el cliente el cual es generado por jwt

  // 1. ¿Trae el token? Debe venir así: "Bearer eyJhbGciOi..."
  if (!header || !header.startsWith('Bearer ')) { // valida que exista el token con la palabra de inicio Bearer
    return res.status(401).json({ msg: 'Token no enviado' });
  }

  try {
    const token = header.split(' ')[1];   // quita la palabra "Bearer"
    const decoded = verifyJWT(token);     // si es falso o venció, salta al catch

    // 2. Buscar al usuario del token, con su empresa, rol y permisos
    const user = await User.findOne({
      where: { id_user: decoded.id_user, company_id: decoded.company_id, delete_user: false },
      include: [
        { model: Company, as: 'company', attributes: ['status_company', 'delete_company'] },
        {
          model: Role, as: 'role', attributes: ['code_role', 'status_role'],
          include: [{
            model: RolePermission, as: 'permissions', attributes: ['id_role_permission'],
            include: [
              { model: Module, as: 'module', attributes: ['code_module'] },
              { model: Action, as: 'action', attributes: ['code_action'] }
            ]
          }]
        }
      ]
    });

    // toJSON() convierte el resultado en un objeto simple con los includes
    const data: any = user?.toJSON();

    // 3. ¿Sigue existiendo y activo? (pudo ser bloqueado después de iniciar sesión)
    if (!data || data.status_user !== 'active' || data.role?.status_role !== 'active'
        || data.company?.status_company !== 'active' || data.company?.delete_company) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    // 4. Guardar el usuario en req.user para los siguientes middlewares y controladores
    req.user = {
    id_user: data.id_user,
    company_id: data.company_id,
    role_id: data.role_id,
    code_role: data.role.code_role,
    first_name: data.first_name,
    last_name: data.last_name,
    email_user: data.email_user,
    permissions: data.role.permissions
        .filter((p: any) => p.module && p.action)                        // descarta permisos sin módulo o acción
        .map((p: any) => `${p.module.code_module}:${p.action.code_action}`)   // 'appointments:read'
    };

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) { // valida el error si expiro
        return res.status(401).json({ msg: 'Token vencido' });
    }
    if (error instanceof JsonWebTokenError) { // si no es valido
        return res.status(401).json({ msg: 'Token no válido' });
    }
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export default checkAuth;