const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const pool = require("../config/db.config"); // <-- ¡Asegúrate de que solo exista UNA línea como esta!
require("dotenv").config();

const authController = {
  register: async (req, res, next) => {
    try {
      const { nombre, apellido, email, contrasena, telefono } = req.body;

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      let id_rol_asignado;
      let nombre_rol_asignado;

      const totalUsersResult = await pool.query(
        "SELECT COUNT(*) AS total_users FROM usuario" // ¡Minúsculas!
      );
      const totalUsers = parseInt(totalUsersResult.rows[0].total_users, 10);

      const operadoresCountResult = await pool.query(
        "SELECT COUNT(*) AS total_operadores FROM usuario WHERE id_rol = 2" // ¡Minúsculas!
      );
      const totalOperadores = parseInt(
        operadoresCountResult.rows[0].total_operadores,
        10
      );

      if (totalUsers === 0) {
        id_rol_asignado = 1;
        nombre_rol_asignado = "Administrador";
      } else if (totalOperadores < 2) {
        id_rol_asignado = 2;
        nombre_rol_asignado = "Operador de Tráfico";
      } else {
        id_rol_asignado = 3;
        nombre_rol_asignado = "Cliente";
      }

      const userData = {
        nombre,
        apellido,
        email,
        contrasena,
        telefono,
        id_rol: id_rol_asignado,
      };

      const user = await userModel.create(userData);

      const token = jwt.sign(
        { id: user.id_usuario, nombre_rol: nombre_rol_asignado }, // id_usuario minúsculas
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "Usuario registrado con éxito",
        token,
        user: {
          id: user.id_usuario, // id_usuario minúsculas
          nombre: user.nombre, // nombre minúsculas
          apellido: user.apellido, // apellido minúsculas
          email: user.email, // email minúsculas
          rol: nombre_rol_asignado,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, contrasena } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena); // contrasena minúsculas
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      if (user.estado === "Inactivo") {
        // estado minúsculas
        return res.status(403).json({ message: "Tu cuenta está desactivada" });
      }

      await pool.query(
        "UPDATE usuario SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1", // ¡Minúsculas!
        [user.id_usuario] // id_usuario minúsculas
      );

      const token = jwt.sign(
        { id: user.id_usuario, nombre_rol: user.nombre_rol }, // id_usuario, nombre_rol minúsculas
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id_usuario, // id_usuario minúsculas
          nombre: user.nombre, // nombre minúsculas
          apellido: user.apellido, // apellido minúsculas
          email: user.email, // email minúsculas
          rol: user.nombre_rol, // nombre_rol minúsculas
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({
        id: user.id_usuario, // id_usuario minúsculas
        nombre: user.nombre, // nombre minúsculas
        apellido: user.apellido, // apellido minúsculas
        email: user.email, // email minúsculas
        telefono: user.telefono, // telefono minúsculas
        estado: user.estado, // estado minúsculas
        rol: user.nombre_rol, // nombre_rol minúsculas
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
