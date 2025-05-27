// backend/controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const pool = require("../config/db.config"); 
require("dotenv").config();

const authController = {
  // Registro de usuarios
  register: async (req, res, next) => {
    try {
      const { nombre, apellido, email, contrasena, telefono } = req.body;

      // Verificar si el email ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      let id_rol_asignado;
      let nombre_rol_asignado;

      // Paso 1: Contar el número total de usuarios
      const totalUsersResult = await pool.query(
        "SELECT COUNT(*) AS total_users FROM USUARIO"
      );
      const totalUsers = parseInt(totalUsersResult.rows[0].total_users, 10);

      // Paso 2: Contar el número de operadores existentes (usando el ID_Rol para 'Operador de Tráfico')
      const operadoresCountResult = await pool.query(
        "SELECT COUNT(*) AS total_operadores FROM USUARIO WHERE ID_Rol = 2"
      ); // ID 2 para Operador de Tráfico
      const totalOperadores = parseInt(
        operadoresCountResult.rows[0].total_operadores,
        10
      );

      if (totalUsers === 0) {
        // Si no hay usuarios, el primero es Administrador
        id_rol_asignado = 1; // ID para Administrador
        nombre_rol_asignado = "Administrador";
      } else if (totalOperadores < 2) {
        // Si hay menos de 2 operadores, el siguiente es Operador de Tráfico
        id_rol_asignado = 2; // ID para Operador de Tráfico
        nombre_rol_asignado = "Operador de Tráfico";
      } else {
        // De lo contrario, el usuario es Cliente
        id_rol_asignado = 3; // ID para Cliente
        nombre_rol_asignado = "Cliente";
      }

      // Crear usuario con el rol asignado
      const userData = {
        nombre,
        apellido,
        email,
        contrasena,
        telefono,
        id_rol: id_rol_asignado, // Usar el rol asignado dinámicamente
      };

      const user = await userModel.create(userData);

      // Crear token
      const token = jwt.sign(
        { id: user.id_usuario, nombre_rol: nombre_rol_asignado }, // Usar el nombre de rol asignado
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "Usuario registrado con éxito",
        token,
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: nombre_rol_asignado, // Enviar el nombre del rol asignado
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Inicio de sesión
  login: async (req, res, next) => {
    try {
      const { email, contrasena } = req.body;

      // Verificar si el usuario existe
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      // Verificar si la contraseña es correcta
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      // Si el usuario está inactivo
      if (user.estado === "Inactivo") {
        return res.status(403).json({ message: "Tu cuenta está desactivada" });
      }

      // Actualizar último acceso
      await pool.query(
        // Aquí 'pool' ya estará definido
        "UPDATE usuario SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1",
        [user.id_usuario]
      );

      // Crear token
      const token = jwt.sign(
        { id: user.id_usuario, nombre_rol: user.nombre_rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.nombre_rol,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener información del usuario actual
  getProfile: async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        estado: user.estado,
        rol: user.nombre_rol,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
