// frontend/src/pages/AdminDashboard.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement"; // Importa el componente de gestión de usuarios
import "../AdminDashboard.css"; // Crea este archivo CSS para estilos del dashboard

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("users"); // Estado para la sección activa

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.rol !== "Administrador") {
    return <p>Acceso denegado. Solo administradores.</p>;
  }

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2>Panel de Administrador</h2>
        <nav>
          <ul>
            <li>
              <button onClick={() => setActiveSection("dashboard")}>
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("users")}>
                Gestión de Usuarios
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("vehicles")}>
                Gestión de Vehículos
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("routes")}>
                Gestión de Rutas
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("requests")}>
                Solicitudes de Clientes
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("incidents")}>
                Incidencias
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("reports")}>
                Reportes
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("reviews")}>
                Reseñas
              </button>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </aside>

      <main className="admin-content">
        <h1>Bienvenido, {user.nombre}!</h1>
        {activeSection === "dashboard" && (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>
              Aquí verás estadísticas y resúmenes de la actividad del sistema.
            </p>
            {/* Aquí irían los widgets de resumen */}
          </div>
        )}
        {activeSection === "users" && <UserManagement />}{" "}
        {/* Renderiza el componente de gestión de usuarios */}
        {activeSection === "vehicles" && (
          <div>
            <h3>Gestión de Vehículos</h3>
            <p>Contenido de gestión de vehículos.</p>
          </div>
        )}
        {activeSection === "routes" && (
          <div>
            <h3>Gestión de Rutas</h3>
            <p>Contenido de gestión de rutas.</p>
          </div>
        )}
        {activeSection === "requests" && (
          <div>
            <h3>Solicitudes de Clientes</h3>
            <p>Contenido de solicitudes.</p>
          </div>
        )}
        {activeSection === "incidents" && (
          <div>
            <h3>Incidencias</h3>
            <p>Contenido de incidencias.</p>
          </div>
        )}
        {activeSection === "reports" && (
          <div>
            <h3>Reportes</h3>
            <p>Contenido de reportes.</p>
          </div>
        )}
        {activeSection === "reviews" && (
          <div>
            <h3>Reseñas</h3>
            <p>Contenido de reseñas.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
