// frontend/src/services/vehicleService.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const getAllVehicles = async (token) => {
  const response = await axios.get(`${API_URL}/vehicles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getVehicleById = async (id, token) => {
  const response = await axios.get(`${API_URL}/vehicles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createVehicle = async (vehicleData, token) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updateVehicle = async (id, vehicleData, token) => {
  const response = await axios.put(`${API_URL}/vehicles/${id}`, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteVehicle = async (id, token) => {
  const response = await axios.delete(`${API_URL}/vehicles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getAvailableDrivers = async (token) => {
  const response = await axios.get(`${API_URL}/vehicles/drivers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const vehicleService = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableDrivers,
};

export default vehicleService;
