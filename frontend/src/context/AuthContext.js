import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, nombre, apellido, email, rol }
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error al parsear usuario almacenado:", e);
          logout();
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        contrasena: password, // backend espera "contrasena"
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return user;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al iniciar sesión.";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Asume que frontend envía: username, email, password, confirmPassword, apellido, telefono (opcionales)
      const { username, email, password, confirmPassword, ...rest } = userData;
      const dataToSend = {
        nombre: username,
        email,
        contrasena: password,
        apellido: rest.apellido || null,
        telefono: rest.telefono || null,
      };

      const response = await axios.post(`${API_URL}/register`, dataToSend);
      toast.success(response.data.message || "Registro exitoso. ¡Bienvenido!");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrarse.";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const hasRole = (requiredRoleName) => user?.rol === requiredRoleName;

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        loading,
        login,
        signup,
        logout,
        clearError,
        hasRole,
        authHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
