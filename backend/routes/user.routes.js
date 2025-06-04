const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { body, validationResult } = require("express-validator");

// Autorización para Admin y Operador de Tráfico
const adminAuth = authMiddleware.authorize(["Administrador"]);
const adminOrOperatorAuth = authMiddleware.authorize([
  "Administrador",
  "Operador de Tráfico",
]);

// Validaciones comunes para usuarios
const userValidationRules = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no debe exceder los 100 caracteres"),
  body("apellido")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El apellido no debe exceder los 100 caracteres"),
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("contrasena")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("telefono")
    .optional({ checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage("El teléfono no debe exceder los 20 caracteres"),
  body("id_rol")
    .isInt({ min: 1 })
    .withMessage("El ID de rol debe ser un número entero válido"),
  body("estado")
    .optional({ checkFalsy: true })
    .isIn(["Activo", "Inactivo"])
    .withMessage("El estado debe ser 'Activo' o 'Inactivo'"),
];

// Middleware para manejar los resultados de la validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    errors: errors.array(),
    message: "Errores de validación",
  });
};

// ====================================================================
// RUTAS DE USUARIOS (ADMIN Y OPERADOR DE TRÁFICO)
// ====================================================================

// Obtener todos los roles (solo Admin)
router.get(
  "/roles",
  authMiddleware.verifyToken,
  adminAuth,
  userController.getAllRoles
);

// Obtener todos los usuarios (Admin y Operador de Tráfico)
router.get(
  "/",
  authMiddleware.verifyToken,
  adminOrOperatorAuth,
  userController.getAllUsers
);

// Crear un nuevo usuario (Admin)
router.post(
  "/",
  authMiddleware.verifyToken,
  adminAuth,
  [
    body("contrasena")
      .notEmpty()
      .withMessage("La contraseña es obligatoria para nuevos usuarios."),
    ...userValidationRules, // Reglas comunes de validación
  ],
  validate,
  userController.createUser
);

// Obtener un usuario por ID (Admin)
router.get(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  userController.getUserById
);

// Actualizar un usuario (Admin y Operador de Tráfico)
router.put(
  "/:id",
  authMiddleware.verifyToken,
  adminOrOperatorAuth,
  userValidationRules,
  validate,
  userController.updateUser
);

// Eliminar un usuario (Admin)
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  userController.deleteUser
);

module.exports = router;
