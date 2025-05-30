// backend/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
require("dotenv").config();

const authMiddleware = {
  // Middleware para verificar el token JWT
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación." });
    }

    const token = authHeader.split(" ")[1]; // El token viene como "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Formato de token inválido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expirado." });
        }
        return res.status(403).json({ message: "Token inválido." });
      }
      req.user = user; // Guarda la información del usuario decodificada en req.user
      next();
    });
  },

  // Middleware para autorizar roles
  authorize: (allowedRoleNames) => {
    return (req, res, next) => {
      // Primero, verifica que el usuario esté autenticado (req.user debe estar disponible)
      if (!req.user || !req.user.nombre_rol) {
        // Esto no debería ocurrir si verifyToken se ejecuta antes, pero es una salvaguarda
        return res
          .status(403)
          .json({ message: "Acceso denegado. No hay información de rol." });
      }

      // console.log("Rol del usuario:", req.user.nombre_rol); // Para depuración
      // console.log("Roles permitidos:", allowedRoleNames); // Para depuración

      if (allowedRoleNames.includes(req.user.nombre_rol)) {
        next(); // El rol está permitido
      } else {
        res
          .status(403)
          .json({ message: "Acceso denegado. Rol no autorizado." });
      }
    };
  },
};

module.exports = authMiddleware;
