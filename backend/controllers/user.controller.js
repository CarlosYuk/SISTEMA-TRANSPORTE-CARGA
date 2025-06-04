const userModel = require("../models/user.model");
const pool = require("../config/db.config"); // Asegúrate de importar el pool
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator"); // Si usas validación de entrada

const userController = {
  // Obtener todos los usuarios con su rol
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userModel.findAllUsers();

      // Solo mostrar los usuarios con rol de "Cliente" para operadores de tráfico
      if (req.user.nombre_rol === "Operador de Tráfico") {
        const filteredUsers = users.filter((user) => user.rol === "Cliente");
        return res.json(filteredUsers);
      }

      res.json(users); // Si no es operador de tráfico, devuelve todos los usuarios
    } catch (error) {
      next(error);
    }
  },

  // Obtener un usuario por ID (opcional para detalles)
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Crear un nuevo usuario (solo para Admin y Operadores de Tráfico)
  createUser: async (req, res, next) => {
    // Validación de entrada (ejemplo con express-validator, si lo usas)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido, email, contrasena, telefono, id_rol, estado } =
      req.body;
    try {
      // Verificar si el email ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Solo permitir "Operador de Tráfico" crear usuarios con rol de "Cliente"
      if (req.user.nombre_rol === "Operador de Tráfico" && id_rol !== 3) {
        return res
          .status(403)
          .json({ message: "Solo puedes crear usuarios 'Cliente'." });
      }

      const newUser = await userModel.create({
        nombre,
        apellido,
        email,
        contrasena, // Ya se hashea en el modelo
        telefono,
        id_rol,
        estado: estado || "Activo", // Por defecto 'Activo' si no se especifica
      });

      // Incluimos el rol y otros detalles en la respuesta
      res
        .status(201)
        .json({ message: "Usuario creado con éxito", user: newUser });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { nombre, apellido, email, telefono, id_rol, estado, contrasena } =
      req.body; // Se puede actualizar la contraseña opcionalmente

    try {
      // Si se proporciona una nueva contraseña, hashearla
      let hashedPassword;
      if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, 10);
      }

      const updatedUser = await userModel.update(userId, {
        nombre,
        apellido,
        email,
        telefono,
        id_rol,
        estado,
        contrasena: hashedPassword, // Pasamos la contraseña hasheada o undefined
      });

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado para actualizar" });
      }
      res.json({ message: "Usuario actualizado con éxito", user: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const deletedCount = await userModel.delete(userId);
      if (deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado para eliminar" });
      }
      res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
      next(error);
    }
  },

  // Obtener todos los roles
  getAllRoles: async (req, res, next) => {
    try {
      // Asegúrate que la tabla 'rol' y la columna 'nombre_rol' estén en minúsculas
      const result = await pool.query(
        "SELECT id_rol, nombre_rol FROM rol ORDER BY nombre_rol ASC"
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      next(error); // Pasa el error al middleware de manejo de errores
    }
  },
};

module.exports = userController;
