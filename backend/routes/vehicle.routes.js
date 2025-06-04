// backend/routes/vehicle.routes.js
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadVehicleImage = require("../middlewares/upload.middleware");
const { body } = require("express-validator");

const adminAuth = authMiddleware.authorize(["Administrador"]);
const adminOrOperatorAuth = authMiddleware.authorize([
  "Administrador",
  "Operador de Tráfico",
]);

// Rutas GET
router.get(
  "/",
  authMiddleware.verifyToken,
  adminOrOperatorAuth, // Operador de tráfico también puede ver vehículos
  vehicleController.getAllVehicles
);

router.get(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  vehicleController.getVehicleById
);

// Ruta POST
router.post(
  "/",
  authMiddleware.verifyToken,
  adminOrOperatorAuth, // Operador de tráfico también puede crear vehículos
  uploadVehicleImage.single("imagen"),
  [
    body("placa").notEmpty().withMessage("La placa es obligatoria."),
    body("marca").notEmpty().withMessage("La marca es obligatoria."),
    body("modelo").notEmpty().withMessage("El modelo es obligatorio."),
    body("anio")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("El año debe ser un número válido."),
    body("capacidad_carga")
      .isFloat({ gt: 0 })
      .withMessage("La capacidad de carga debe ser un número positivo."),
    body("tipo_combustible")
      .notEmpty()
      .withMessage("El tipo de combustible es obligatorio."),
    body("estado_vehiculo")
      .notEmpty()
      .withMessage("El estado del vehículo es obligatorio."),
    body("nombre_conductor")
      .isString()
      .optional({ nullable: true, checkFalsy: true })
      .withMessage("El nombre del conductor debe ser un texto."),
    body("ultima_revision")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage(
        "La última revisión debe ser una fecha válida (YYYY-MM-DD)."
      ),
  ],
  vehicleController.createVehicle
);

// Ruta PUT
router.put(
  "/:id",
  authMiddleware.verifyToken,
  adminOrOperatorAuth, // Operador de tráfico también puede actualizar vehículos
  uploadVehicleImage.single("imagen"),
  [
    body("placa").notEmpty().withMessage("La placa es obligatoria."),
    body("marca").notEmpty().withMessage("La marca es obligatoria."),
    body("modelo").notEmpty().withMessage("El modelo es obligatorio."),
    body("anio")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("El año debe ser un número válido."),
    body("capacidad_carga")
      .isFloat({ gt: 0 })
      .withMessage("La capacidad de carga debe ser un número positivo."),
    body("tipo_combustible")
      .notEmpty()
      .withMessage("El tipo de combustible es obligatorio."),
    body("estado_vehiculo")
      .notEmpty()
      .withMessage("El estado del vehículo es obligatorio."),
    body("nombre_conductor")
      .isString()
      .optional({ nullable: true, checkFalsy: true })
      .withMessage("El nombre del conductor debe ser un texto."),
    body("ultima_revision")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage(
        "La última revisión debe ser una fecha válida (YYYY-MM-DD)."
      ),
  ],
  vehicleController.updateVehicle
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth, // Solo los administradores pueden eliminar vehículos
  vehicleController.deleteVehicle
);

module.exports = router;
