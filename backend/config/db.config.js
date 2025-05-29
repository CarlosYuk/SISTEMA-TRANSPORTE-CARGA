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

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error al conectar a PostgreSQL:", err);
    return;
  }
  console.log("Conexión a PostgreSQL establecida con éxito");
  client.release();
});

module.exports = pool; // Exporta el pool directamente, sin un objeto
