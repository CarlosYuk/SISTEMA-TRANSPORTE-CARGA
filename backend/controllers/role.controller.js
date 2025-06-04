// backend/controllers/role.controller.js
const Role = require("../models/role.model"); // Importa el modelo de rol

const roleController = {
  getAllRoles: async (req, res, next) => {
    try {
      const roles = await Role.getAllRoles();
      res.status(200).json(roles);
    } catch (err) {
      console.error("Error al obtener todos los roles:", err);
      next(err);
    }
  },
  // Opcional: Función para crear un rol
  // createRole: async (req, res, next) => {
  //   const { nombre_rol } = req.body;
  //   try {
  //     const newRole = await Role.create(nombre_rol);
  //     res.status(201).json({ message: "Rol creado exitosamente.", role: newRole });
  //   } catch (err) {
  //     console.error("Error al crear rol:", err);
  //     next(err);
  //   }
  // }
};


module.exports = roleController;
