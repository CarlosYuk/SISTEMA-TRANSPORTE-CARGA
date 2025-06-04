// backend/config/db.config.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Opcional: conectar y comprobar al inicio, pero no es obligatorio
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL:", err);
    // Aquí podrías decidir si lanzar error o terminar el proceso para evitar que siga con error
    process.exit(1);
  } else {
    console.log("Conexión a PostgreSQL establecida con éxito");
    done(); // Liberar cliente (se recomienda usar done() en lugar de client.release() cuando usas pool.connect)
  }
});

module.exports = pool; // Exporta el pool para usarlo en consultas
