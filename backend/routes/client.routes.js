const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Asegúrate de tener autenticación en el middleware

// Rutas de perfil
router.get("/profile", authMiddleware.verifyToken, clientController.getProfile);

// Rutas de solicitudes
router.get(
  "/solicitudes",
  authMiddleware.verifyToken,
  clientController.getSolicitudesByCliente
);

module.exports = router;
