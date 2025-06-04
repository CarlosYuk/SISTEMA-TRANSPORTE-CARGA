// frontend/src/services/userService.js
import axios from "./axiosConfig"; // Asegúrate de que tu axiosConfig esté bien configurado

const API_URL = "/api/users"; // La base de tus rutas de usuario

const userService = {
  // Obtener todos los usuarios
  getAllUsers: async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUserById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData, token) => {
    try {
      const response = await axios.post(API_URL, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData, token) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener todos los roles (para el formulario de creación/edición)
  getAllRoles: async (token) => {
    try {
      // Nota: El endpoint para roles está en authController, pero lo llamamos desde user.controller.js
      // Para este ejemplo, asumiremos que /api/users/roles es la ruta.
      // Si en tu backend definiste otra ruta para getAllRoles (por ejemplo, en auth.routes.js),
      // ajusta esta URL. Basado en el user.controller.js que te di, deberías añadir esta ruta
      // en user.routes.js, por ejemplo: router.get("/roles", authMiddleware.verifyToken, adminAuth, userController.getAllRoles);
      const response = await axios.get(`${API_URL}/roles`, {
        // Asumo que se añadió esta ruta en user.routes.js
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },
};

export default userService;
