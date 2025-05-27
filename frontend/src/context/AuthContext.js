// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Asegúrate de tener react-toastify instalado

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // `user` contendrá { id, nombre, apellido, email, rol }
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL base de tu backend
  const API_URL = 'http://localhost:5000/api/auth'; // Ruta base para autenticación

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser)); // El objeto user guardado ya debería tener el rol
        } catch (e) {
          console.error("Error al parsear el usuario almacenado:", e);
          logout(); // Limpiar si hay un error al parsear
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (credentials) => { // Espera { email, contrasena }
    setLoading(true);
    setError(null);
    try {
      // Tu backend espera 'contrasena', no 'password'
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        contrasena: credentials.password // Mapeamos password de frontend a contrasena de backend
      });
      
      const { token, user } = response.data; // Recibe token y user del backend
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Guarda el objeto user (con rol)

      setToken(token);
      setUser(user); // user: { id, nombre, apellido, email, rol }
      
      return user; // Devolver el usuario logueado para que Login.js lo use en la redirección
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Propagar el error para que Formik lo maneje si es necesario
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => { // Espera { nombre, apellido, email, contrasena, telefono }
    setLoading(true);
    setError(null);
    try {
      // Mapeamos los campos del frontend a los que espera el backend
      const { username, email, password, confirmPassword, ...otherData } = userData; // Remueve confirmPassword
      const dataToSend = {
        nombre: username, // Asume que 'username' es el 'nombre' del backend
        email,
        contrasena: password, // Mapeamos password de frontend a contrasena de backend
        // Si el formulario de registro tiene 'apellido' y 'telefono', inclúyelos aquí.
        // Por ahora, asumimos que 'apellido' y 'telefono' no son obligatorios en tu SignUp.js actual
        // o que los estás obteniendo de 'otherData' si los añades al formulario.
        // Si no los envías, asegúrate de que tu backend los maneje como opcionales o con valores por defecto.
        apellido: otherData.apellido || null, // Ejemplo si lo añades al form
        telefono: otherData.telefono || null, // Ejemplo si lo añades al form
      };

      const response = await axios.post(`${API_URL}/register`, dataToSend);
      toast.success(response.data.message || "Registro exitoso. ¡Bienvenido!"); // Mensaje del backend
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
    // No reseteamos loading a true aquí, ya que no estamos cargando nada.
    // Solo si el logout implicara una llamada asíncrona.
  };

  const clearError = () => setError(null);

  // Helper para verificar el rol basado en el NOMBRE del rol ('administrador', 'operador_rutas', 'cliente')
  const hasRole = (requiredRoleName) => {
    return user && user.rol === requiredRoleName;
  };

  // Puedes añadir un getter de headers para peticiones autenticadas
  const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  return (
    <AuthContext.Provider value={{ user, token, error, loading, login, signup, logout, clearError, hasRole, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;