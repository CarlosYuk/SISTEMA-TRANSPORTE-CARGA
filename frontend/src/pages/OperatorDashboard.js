// Ejemplo: frontend/src/pages/operatorDashboard.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OperatorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // O a la home, según tu preferencia
  };

  return (
    <div>
      <h1>Panel del Operador</h1>
      <p>
        Bienvenido, {user ? user.nombre + " " + user.apellido : "Usuario"} (Rol:{" "}
        {user ? user.rol : "Desconocido"})
      </p>
      <p>Tu email: {user ? user.email : ""}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Aquí el contenido específico del administrador */}
    </div>
  );
}
export default OperatorDashboard;
