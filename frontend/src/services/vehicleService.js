import axios from "axios";

const getVehicles = async () => {
  try {
    const response = await axios.get("/vehicles");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getVehicleById = async (id) => {
  try {
    const response = await axios.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createVehicle = async (vehicleData) => {
  try {
    const response = await axios.post("/vehicles", vehicleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await axios.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteVehicle = async (id) => {
  try {
    const response = await axios.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const vehicleService = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};

export default vehicleService;
