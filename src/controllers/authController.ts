import { Request, Response } from 'express';
import { User, Company, Role } from '../associations';
import { generateJWT } from '../helpers/jwt';

// POST /api/auth/login
// body: { company_slug, email_user, password_user }
const login = async (req: Request, res: Response) => {
  const { company_slug, email_user, password_user } = req.body ?? {};

  // Validación básica (en el paso 6 la haremos con zod)
  if (!company_slug || !email_user || !password_user) {
    return res.status(400).json({ msg: 'Empresa, correo y contraseña son obligatorios' });
  }

  // Mismo mensaje para "no existe" y "contraseña mala": así nadie puede adivinar qué correos existen
  const invalid = () => res.status(401).json({ msg: 'Correo o contraseña incorrectos' });

  try {
    // 1. La empresa (cada peluquería tiene su slug: "barberia-el-parche")
    const company = await Company.findOne({ where: { slug: company_slug, delete_company: false } });
    if (!company) return invalid();
    if (company.status_company !== 'active') {
      return res.status(403).json({ msg: 'La empresa no está activa' });
    }

    // 2. El usuario de ESA empresa, con la contraseña (scope withPassword)
    const user = await User.scope('withPassword').findOne({
      where: { company_id: company.id_company, email_user, delete_user: false },
      include: [{ model: Role, as: 'role', attributes: ['name_role', 'code_role', 'status_role'] }]
    });
    if (!user) return invalid();

    // 3. Comparar contraseña con el hash
    if (!(await user.checkPassword(password_user))) return invalid();

    // 4. ¿Está activo?
    const role: any = user.get('role');
    if (user.status_user !== 'active' || role?.status_role !== 'active') {
      return res.status(403).json({ msg: 'Tu usuario está inactivo o bloqueado' });
    }

    // 5. Guardar la fecha del último inicio de sesión
    await user.update({ last_login_at: new Date() });

    // 6. Responder con los datos y el token (SIN la contraseña)
    return res.json({
      id_user: user.id_user,
      first_name: user.first_name,
      last_name: user.last_name,
      email_user: user.email_user,
      role: { name_role: role.name_role, code_role: role.code_role },
      company: { id_company: company.id_company, name_company: company.name_company, slug: company.slug },
      token: generateJWT({ id_user: user.id_user, company_id: user.company_id })
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
};

// GET /api/auth/profile  (privada: necesita checkAuth)
const profile = (req: Request, res: Response) => {
  return res.json({ profile: req.user });
};

export { login, profile };