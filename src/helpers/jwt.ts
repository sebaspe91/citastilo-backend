import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';

// Lee la palabra secreta del .env; si no existe, mejor fallar que firmar con "undefined"
const getSecret = (): string => { // :string es el tipo de retorno de la función. Es obligatorio porque si no, TypeScript no sabe que va a devolver un string
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error('Falta JWT_SECRET en el archivo .env. No se puede firmar ni verificar tokens JWT sin una palabra secreta.');
    return secret;
};

// crea el token y lo devuelve como string
export const generateJWT = (payload: JwtPayload): string => { // JwtPayload es la interface que define lo que va dentro del token (el "payload"). Solo ids: nada secreto
    return jwt.sign(payload, getSecret(), { expiresIn: '1h' }); // el token expira en 1 hora ----> .sing arma el token y lo firma con la palabra secreta
}

// Comprueba el token: si es falso o ya venció, lanza un error
export const verifyJWT = (token: string): JwtPayload => { // JwtPayload es la interface que define lo que va dentro del token (el "payload"). Solo ids: nada secreto
    return jwt.verify(token, getSecret()) as JwtPayload; // verifica que este firmado y q este completo y el as Jwtplayload es para que typeScript confie en el
};