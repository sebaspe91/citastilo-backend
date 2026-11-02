// Carga el .env ANTES de leer process.env
import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Datos de conexión desde el .env
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// Si falta algún dato obligatorio, el servidor no arranca y te dice cuál falta
if (!DB_NAME || !DB_USER || !DB_HOST) {
  throw new Error('Faltan variables de entorno de la base de datos: DB_NAME, DB_USER o DB_HOST');
}

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || '', {
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  dialect: 'mysql',
  timezone: '+00:00', // guarda y lee las fechas en UTC (cada empresa tiene su zona en companies.timezone)
  logging: false,     // true = muestra en consola cada consulta SQL (útil para depurar)
  pool: {             // conexiones reutilizables (igual que en tuMovil) para todas las peticiones a la base de datos
    max: 5,           // máximo 5 conexiones abiertas a la vez
    min: 0,
    acquire: 30000,   // espera máximo 30 s para conseguir una conexión
    idle: 10000       // cierra una conexión que lleve 10 s sin usarse
  }
});

export default db;