// backend/routes/role.routes.js
const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller"); // Necesitamos este controlador
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware para que solo los administradores puedan ver/gestionar roles (ajusta según tus necesidades)
const adminAuth = authMiddleware.authorize(["Administrador"]);

// Ruta para obtener todos los roles (útil para la gestión de usuarios, formularios de registro/edición)
router.get(
  "/",
  authMiddleware.verifyToken,
  adminAuth, // Solo administradores pueden ver todos los roles en este ejemplo
  roleController.getAllRoles
);

// Opcional: Ruta para crear un rol
// router.post(
//   "/",
//   authMiddleware.verifyToken,
//   adminAuth,
//   roleController.createRole
// );

module.exports = router;
