import axios from "./axiosConfig"; // Usa la instancia configurada con baseURL

const API_URL = "/api/vehicles";

const authHeaders = (token, isMultipart = false) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...(isMultipart && { "Content-Type": "multipart/form-data" }),
  },
});

const vehicleService = {
  getAllVehicles: async (token) => {
    try {
      const response = await axios.get(API_URL, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error fetching all vehicles:", error);
      throw error;
    }
  },

  getVehicleById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  createVehicle: async (vehicleData, token) => {
    try {
      const response = await axios.post(
        API_URL,
        vehicleData,
        authHeaders(token, true)
      );
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  updateVehicle: async (id, vehicleData, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        vehicleData,
        authHeaders(token, true)
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  deleteVehicle: async (id, token) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        authHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  getAvailableDrivers: async (token) => {
    try {
      const response = await axios.get(
        `${API_URL}/drivers`,
        authHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      throw error;
    }
  },
};

export default vehicleService;
