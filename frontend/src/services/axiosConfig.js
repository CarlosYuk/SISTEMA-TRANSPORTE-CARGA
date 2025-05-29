// frontend/src/services/axiosConfig.js
import axios from "axios";

// La URL base de tu backend
// Si tu backend está en localhost:5000, esta es la configuración
axios.defaults.baseURL = "http://localhost:5000";

export default axios;
