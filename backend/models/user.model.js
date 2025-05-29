const pool = require("../config/db.config");
const bcrypt = require("bcryptjs");

const userModel = {
  findByEmail: async (email) => {
    try {
      const result = await pool.query(
        `SELECT
           u.id_usuario, u.nombre, u.apellido, u.email, u.contrasena, u.telefono, u.estado, u.fecha_creacion, u.ultimo_acceso,
           r.nombre_rol AS nombre_rol, u.id_rol
         FROM
           usuario AS u -- ¡Asegúrate de que 'usuario' esté en minúsculas!
         JOIN
           rol AS r ON u.id_rol = r.id_rol -- ¡Asegúrate de que 'rol' y 'id_rol' estén en minúsculas!
         WHERE
           u.email = $1`,
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const result = await pool.query(
        `SELECT
           u.id_usuario, u.nombre, u.apellido, u.email, u.contrasena, u.telefono, u.estado, u.fecha_creacion, u.ultimo_acceso,
           r.nombre_rol AS nombre_rol, u.id_rol
         FROM
           usuario AS u -- ¡Minúsculas!
         JOIN
           rol AS r ON u.id_rol = r.id_rol -- ¡Minúsculas!
         WHERE
           u.id_usuario = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error al buscar usuario por ID:", error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const { nombre, apellido, email, contrasena, telefono, id_rol, estado } =
        userData;
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const result = await pool.query(
        `INSERT INTO usuario (nombre, apellido, email, contrasena, telefono, id_rol, estado) -- ¡Minúsculas para todo!
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id_usuario, nombre, apellido, email, telefono, id_rol, estado;`,
        [
          nombre,
          apellido,
          email,
          hashedPassword,
          telefono,
          id_rol,
          estado || "Activo",
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  findAllUsers: async () => {
    try {
      const result = await pool.query(
        `SELECT
           u.id_usuario, u.nombre, u.apellido, u.email, u.telefono, u.estado, u.fecha_creacion, u.ultimo_acceso,
           r.nombre_rol AS rol, r.id_rol as id_rol
         FROM
           usuario AS u -- ¡Minúsculas!
         JOIN
           rol AS r ON u.id_rol = r.id_rol -- ¡Minúsculas!
         ORDER BY
           u.nombre ASC`
      );
      return result.rows;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  },

  update: async (id, userData) => {
    const { nombre, apellido, email, telefono, id_rol, estado, contrasena } =
      userData;
    let query = `UPDATE usuario SET -- ¡Minúsculas!
                     nombre = COALESCE($1, nombre),
                     apellido = COALESCE($2, apellido),
                     email = COALESCE($3, email),
                     telefono = COALESCE($4, telefono),
                     id_rol = COALESCE($5, id_rol),
                     estado = COALESCE($6, estado)
                   WHERE id_usuario = $7 -- ¡Minúsculas!
                   RETURNING *;`;
    let values = [nombre, apellido, email, telefono, id_rol, estado, id];

    if (contrasena) {
      query = `UPDATE usuario SET -- ¡Minúsculas!
                     nombre = COALESCE($1, nombre),
                     apellido = COALESCE($2, apellido),
                     email = COALESCE($3, email),
                     contrasena = $8, -- La contraseña ya viene hasheada desde el controlador
                     telefono = COALESCE($4, telefono),
                     id_rol = COALESCE($5, id_rol),
                     estado = COALESCE($6, estado)
                   WHERE id_usuario = $7 -- ¡Minúsculas!
                   RETURNING *;`;
      values.push(contrasena);
    }

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        "DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario;", // ¡Minúsculas!
        [id]
      );
      return result.rowCount;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },
};

module.exports = userModel;
