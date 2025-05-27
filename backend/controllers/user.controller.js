const userModel = require("../models/user.model");

// Controlador para manejar las operaciones de usuarios
const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userModel.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Crear un nuevo usuario
  createUser: async (req, res, next) => {
    try {
      // Verificar si el email ya existe
      const existingUser = await userModel.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const user = await userModel.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingUser = await userModel.findById(id);

      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const user = await userModel.update(id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingUser = await userModel.findById(id);

      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const user = await userModel.delete(id);
      res.json({ message: "Usuario eliminado correctamente", user });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
