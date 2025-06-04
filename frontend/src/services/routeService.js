// frontend/src/services/routeService.js
import axios from "./axiosConfig"; // Asegúrate de que axios esté configurado

const API_URL = "/api/routes"; // Ajusta según tu API

const routeService = {
  // Obtener todas las rutas
  getAllRoutes: async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching routes:", error);
      throw error;
    }
  },

  // Obtener una ruta por su ID
  getRouteById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching route with ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva ruta
  createRoute: async (routeData, token) => {
    try {
      const response = await axios.post(API_URL, routeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating route:", error);
      throw error;
    }
  },
};

export default routeService;
