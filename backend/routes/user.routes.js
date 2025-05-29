const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // ¡Asegúrate de la ruta correcta aquí!
const { body, validationResult } = require("express-validator"); // Asegúrate de importar validationResult también

// Middleware de autorización para administradores
const adminAuth = authMiddleware.authorize(["Administrador"]);

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
  // La contraseña es requerida solo al crear, opcional al actualizar
  body("contrasena")
    .optional() // Permite que la contraseña sea opcional para actualizaciones
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
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
    message: "Errores de validación",
  });
};

// ====================================================================
// CONSOLIDACIÓN Y ORDEN CORRECTO DE LAS RUTAS
// ====================================================================

// 1. Obtener todos los roles (ruta estática, DEBE IR ANTES DE /:id)
router.get(
  "/roles",
  authMiddleware.verifyToken,
  adminAuth,
  userController.getAllRoles
);

// 2. Obtener todos los usuarios (ruta estática)
router.get(
  "/",
  authMiddleware.verifyToken,
  adminAuth,
  userController.getAllUsers
);

// 3. Crear un nuevo usuario (POST /api/users)
router.post(
  "/",
  authMiddleware.verifyToken,
  adminAuth,
  // Para la creación, la contraseña es obligatoria.
  // Podemos hacer una validación condicional en el controlador o aquí.
  // Por ahora, asegúrate de que el frontend siempre envíe una contraseña al crear.
  [
    body("contrasena")
      .notEmpty()
      .withMessage("La contraseña es obligatoria para nuevos usuarios."),
    ...userValidationRules, // Aplicamos las reglas de validación comunes
  ],
  validate, // Aplica el middleware de validación
  userController.createUser
);

// 4. Obtener un usuario por ID (ruta dinámica, DEBE IR DESPUÉS DE RUTAS ESTÁTICAS COMO /roles)
router.get(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  userController.getUserById
);

// 5. Actualizar un usuario existente (PUT /api/users/:id)
router.put(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  // La contraseña es opcional aquí porque userValidationRules ya la marca como optional()
  userValidationRules, // Aplicamos validaciones comunes
  validate, // Aplica el middleware de validación
  userController.updateUser
);

// 6. Eliminar un usuario (DELETE /api/users/:id)
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  adminAuth,
  userController.deleteUser
);

module.exports = router;
