const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Rutas protegidas (requieren autenticación)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  userController.getAllUsers
);
router.get("/:id", authMiddleware, userController.getUserById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  userController.createUser
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  userController.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Administrador"]),
  userController.deleteUser
);

module.exports = router;
