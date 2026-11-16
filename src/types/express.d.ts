import { AuthUser } from './auth';

// Le agregamos a Request de Express la propiedad "user"
declare global { // es una variable global, no hace falta exportarla. Solo sirve para que TypeScript sepa que existe y no tire error de "no existe la propiedad user"
  namespace Express { // Le agregamos a Request de Express la propiedad "user"
    interface Request { // Le agregamos a Request de Express la propiedad "user"
      user?: AuthUser; // El usuario autenticado que checkAuth deja en req.user. Es opcional porque no siempre va a estar presente, solo cuando el usuario esté autenticado
    }
  }
}

export {}; // Esto es para que TypeScript sepa que este archivo es un módulo y no tire error de "Cannot redeclare block-scoped variable 'Request'". No hace falta exportar nada, solo sirve para que TypeScript sepa que este archivo es un módulo.