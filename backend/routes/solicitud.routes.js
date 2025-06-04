// backend/routes/solicitud.routes.js
const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/solicitud.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Ruta para obtener las solicitudes del cliente
router.get("/", authMiddleware.verifyToken, solicitudController.getSolicitudes);

// Ruta para crear una nueva solicitud
router.post(
  "/",
  authMiddleware.verifyToken,
  solicitudController.createSolicitud
);

module.exports = router;
