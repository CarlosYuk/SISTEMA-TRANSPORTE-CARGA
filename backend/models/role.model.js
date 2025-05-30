// backend/models/role.model.js
const pool = require("../config/db.config");

const Role = {
  // Encuentra un rol por su ID
  findById: async (id) => {
    const result = await pool.query(`SELECT * FROM rol WHERE id_rol = $1`, [
      id,
    ]);
    return result.rows[0];
  },

  // Encuentra un rol por su nombre
  findByName: async (name) => {
    const result = await pool.query(`SELECT * FROM rol WHERE nombre_rol = $1`, [
      name,
    ]);
    return result.rows[0];
  },

  // Obtiene todos los roles
  getAllRoles: async () => {
    const result = await pool.query(`SELECT * FROM rol ORDER BY id_rol ASC`);
    return result.rows;
  },

  // Opcional: Crear un nuevo rol (si tu aplicación permite crear roles dinámicamente)
  create: async (name) => {
    const result = await pool.query(
      `INSERT INTO rol (nombre_rol) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  },
};

module.exports = Role;
