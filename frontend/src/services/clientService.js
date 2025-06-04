import axios from "./axiosConfig";

const API_URL = "/api/client";

const clientService = {
  // Obtener perfil del cliente
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  // Obtener solicitudes del cliente
  getSolicitudes: async () => {
    const response = await axios.get(`${API_URL}/solicitudes`);
    return response.data;
  },

  // Actualizar el estado de una solicitud
  updateSolicitud: async (id, estado_solicitud) => {
    const response = await axios.put(`${API_URL}/solicitudes/${id}`, {
      estado_solicitud,
    });
    return response.data;
  },
};

export default clientService;
