// frontend/src/pages/AdminDashboard.js
import React, { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import VehicleManagement from "../components/VehicleManagement";
// Importa otros componentes de gestión si los tienes (ej. RouteManagement, ClientRequests, etc.)
// import RouteManagement from "../components/RouteManagement";
// import ClientRequests from "../components/ClientRequests";

import "../AdminDashboard.css"; // Asegúrate de que este archivo CSS existe
const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Usa un solo estado para la sección activa
  const [activeSection, setActiveSection] = useState("dashboard"); // Estado inicial

  // Manejador para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Redireccionar si el usuario no es un administrador o no está autenticado
  // Esta lógica ya está en PrivateRoute, pero es una buena práctica tenerla aquí también
  if (!user || user.rol !== "Administrador") {
    // Si llegas aquí, PrivateRoute ya debería haberte redirigido,
    // pero si por alguna razón no lo hizo, esto actuará como un fallback.
    // Podrías redirigir o mostrar un mensaje.
    // navigate('/login'); // O redirigir a una página de acceso denegado
    return (
      <p>Acceso denegado. Solo los administradores pueden ver esta página.</p>
    );
  }

  // Función para renderizar el componente activo según el estado 'activeSection'
  const renderActiveContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>
              Aquí verás estadísticas y resúmenes de la actividad del sistema.
            </p>
            {/* Aquí irían los widgets de resumen */}
          </div>
        );
      case "users":
        return <UserManagement />;
      case "vehicles":
        return <VehicleManagement />; // Renderiza VehicleManagement cuando la sección activa es 'vehicles'
      case "routes":
        // return <RouteManagement />; // Descomenta y crea este componente cuando sea necesario
        return (
          <div>
            <h3>Gestión de Rutas</h3>
            <p>Contenido de gestión de rutas.</p>
          </div>
        );
      case "requests":
        // return <ClientRequests />; // Descomenta y crea este componente cuando sea necesario
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
      {/* Pasa la función `setActiveSection` al Sidebar para que pueda cambiar el estado */}
      <Sidebar
        setActiveSection={setActiveSection} // Asegúrate de que Sidebar acepte esta prop
        handleLogout={handleLogout} // También puedes pasar handleLogout al Sidebar
        user={user} // Pasar usuario para mostrar su nombre
      />
      <main className="admin-content">
        <h1>Bienvenido, {user.nombre}!</h1>{" "}
        {/* Muestra el nombre del usuario */}
        {renderActiveContent()} {/* Renderiza el contenido dinámico */}
      </main>
    </div>
  );
};

export default AdminDashboard;
