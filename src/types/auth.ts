// Lo que va DeENTRO del token (el "payload"). Solo ids: nada secreto
export interface JwtPayload {
    id_user: string;
    company_id: string;
};

// El usuario autenticado que checkAuth deja en req.user
export interface AuthUser {
    id_user: string;
    company_id: string;
    role_id: string;
    code_role: string;
    first_name: string;
    last_name: string;
    email_user: string;
    permissions: string[]; // Lista de permisos del rol del usuario ej: ['appointments:create', 'appointments:read', 'appointments:update', 'appointments:delete']
}