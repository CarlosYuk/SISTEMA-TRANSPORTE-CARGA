import React, { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import VehicleManagement from "../components/VehicleManagement";
// import RouteManagement from "../components/RouteManagement";
// import ClientRequests from "../components/ClientRequests";

import "../AdminDashboard.css";
import "../App.css";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Validación: redirigir o mostrar acceso denegado
  if (!user || user.rol !== "Administrador") {
    return (
      <div className="access-denied">
        <p>Acceso denegado. Solo administradores pueden ver esta página.</p>
      </div>
    );
  }

  const renderActiveContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>
              Aquí verás estadísticas y resúmenes de la actividad del sistema.
            </p>
          </div>
        );
      case "users":
        return <UserManagement />;
      case "vehicles":
        return <VehicleManagement />;
      case "routes":
        return (
          <div>
            <h3>Gestión de Rutas</h3>
            <p>Contenido de gestión de rutas.</p>
          </div>
        );
      case "requests":
        return (
          <div>
            <h3>Solicitudes de Clientes</h3>
            <p>Contenido de solicitudes.</p>
          </div>
        );
      case "incidents":
        return (
          <div>
            <h3>Incidencias</h3>
            <p>Contenido de incidencias.</p>
          </div>
        );
      case "reports":
        return (
          <div>
            <h3>Reportes</h3>
            <p>Contenido de reportes.</p>
          </div>
        );
      case "reviews":
        return (
          <div>
            <h3>Reseñas</h3>
            <p>Contenido de reseñas.</p>
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
      />
      <main className="admin-content">
        <h1>Bienvenido, {user.nombre}!</h1>
        {renderActiveContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
