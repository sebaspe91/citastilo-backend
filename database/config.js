require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  seederStorage: 'sequelize',              // guarda qué seeders ya se ejecutaron
  seederStorageTableName: 'SequelizeData', // en esta tabla (como SequelizeMeta para migrations)
};

module.exports = {
  development: base,
  production: base,
};