const pool = require("../config/db.config");
const bcrypt = require("bcryptjs");

const userModel = {
  // Obtener todos los usuarios
  findAll: async () => {
    const query =
      "SELECT u.*, r.nombre_rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol";
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener usuario por ID
  findById: async (id) => {
    const query =
      "SELECT u.*, r.nombre_rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol WHERE u.id_usuario = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Obtener usuario por email
  findByEmail: async (email) => {
    const query =
      "SELECT u.*, r.nombre_rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol WHERE u.email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  // Crear usuario
  create: async (userData) => {
    const { nombre, apellido, email, contrasena, telefono, id_rol } = userData;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const query = `
      INSERT INTO usuario (nombre, apellido, email, contrasena, telefono, estado, fecha_creacion, id_rol)
      VALUES ($1, $2, $3, $4, $5, 'Activo', CURRENT_DATE, $6)
      RETURNING *
    `;

    const values = [nombre, apellido, email, hashedPassword, telefono, id_rol];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const { nombre, apellido, email, telefono, estado, id_rol } = userData;

    const query = `
      UPDATE usuario 
      SET nombre = $1, apellido = $2, email = $3, telefono = $4, estado = $5, id_rol = $6
      WHERE id_usuario = $7
      RETURNING *
    `;

    const values = [nombre, apellido, email, telefono, estado, id_rol, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Actualizar contraseña
  updatePassword: async (id, newPassword) => {
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const query =
      "UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2 RETURNING *";
    const { rows } = await pool.query(query, [hashedPassword, id]);
    return rows[0];
  },

  // Eliminar usuario
  delete: async (id) => {
    const query = "DELETE FROM usuario WHERE id_usuario = $1 RETURNING *";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = userModel;
