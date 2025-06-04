import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirigir si no está autenticado
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // O un loader si quieres

  const { nombre, apellido, rol, email } = user;

  return (
    <div className="client-dashboard">
      <h1>Panel de Cliente</h1>
      <p>
        Bienvenido, {nombre} {apellido} (Rol: {rol})
      </p>
      <p>Email: {email}</p>
      <button onClick={handleLogout} className="btn btn-logout">
        Cerrar Sesión
      </button>
      {/* Aquí puedes agregar el contenido específico para el cliente */}
    </div>
  );
}

export default ClientDashboard;
