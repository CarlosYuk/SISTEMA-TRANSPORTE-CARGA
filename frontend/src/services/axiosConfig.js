import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
  // Puedes agregar headers comunes aquí, por ejemplo:
  // headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
