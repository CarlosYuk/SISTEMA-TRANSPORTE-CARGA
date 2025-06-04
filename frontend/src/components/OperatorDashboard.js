// frontend/src/pages/OperatorDashboard.js
import React, { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import VehicleManagement from "../components/VehicleManagement";
import "../operador.css"; // Asegúrate de tener este archivo con los estilos necesarios

const OperatorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Validar que sea operador o redirigir
  if (!user || user.rol !== "Operador de Tráfico") {
    return (
      <p>
        Acceso denegado. Solo los operadores de rutas pueden ver esta página.
      </p>
    );
  }

  // Controla qué secciones mostrar al operador
  const allowedSections = ["dashboard", "users", "vehicles", "routes"];

  const renderActiveContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-summary">
            <h3>Resumen General - Operador de Rutas</h3>
            <p>Estadísticas y datos relevantes para el operador de rutas.</p>
          </div>
        );
      case "users":
        return (
          <UserManagement
            restrictAdminActions={true} // Pasamos prop para restringir creación/eliminación de admins
          />
        );
      case "vehicles":
        return <VehicleManagement />;
      case "routes":
        return (
          <div>
            <h3>Gestión de Rutas</h3>
            <p>Contenido para gestionar rutas.</p>
          </div>
        );
      default:
        return (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>Selecciona una opción del menú lateral.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        user={user}
        allowedSections={allowedSections}
      />
      <main className="admin-content">
        <h1>Bienvenido, {user.nombre}!</h1>
        {renderActiveContent()}
      </main>
    </div>
  );
};

export default OperatorDashboard;
