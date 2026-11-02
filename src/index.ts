// 1. Primero el .env, antes que cualquier otro import
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db';
// import { router } from "./routes/index.routes";

// iniciamos los recursos de express
const app = express();

// middlewares para permitir el acceso a la API desde cualquier origen y para parsear el cuerpo de las solicitudes como JSON
app.use(cors());
app.use(express.json());

// Ruta de prueba: confirma que la API responde
// _req con guion bajo: es una convención para decir “este parámetro existe, pero no lo uso”. Así TypeScript no se queja.
app.get('/api/health', (_req, res) => {
  res.json({ msg: 'API citaStilo funcionando' });
});

// app.use("/api", router);

const PORT = process.env.PORT || 4000;

// 2. Conecta a la base de datos y SOLO si funciona, arranca el servidor
const startServer = async () => {
  try {
    await db.authenticate(); // prueba la conexión con MySQL
    console.log('Conexión a la base de datos exitosa');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1); // detiene el proceso: no tiene sentido una API sin base de datos
  }
};

startServer();