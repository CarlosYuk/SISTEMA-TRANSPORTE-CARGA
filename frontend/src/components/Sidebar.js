// frontend/src/components/Sidebar.js
import React from "react";
// Si el logout lo manejas directamente en Sidebar, asegúrate de importar AuthContext aquí también.
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// Asegúrate de que este archivo CSS existe
// Recibe setActiveSection y handleLogout (y user) como props
const Sidebar = ({ setActiveSection, handleLogout, user }) => {
  // Si handleLogout se maneja desde AdminDashboard, no necesitas AuthContext ni useNavigate aquí.
  // Si prefieres que Sidebar maneje su propio logout:
  // const { logout } = useContext(AuthContext);
  // const navigate = useNavigate();
  // const handleLocalLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  return (
    <aside className="admin-sidebar">
      {" "}
      {/* Cambiado a <aside> para semántica */}
      <h2>Panel de Administrador</h2>
      {user && (
        <p className="sidebar-welcome-text">Hola, {user.nombre}!</p>
      )}{" "}
      {/* Saludo opcional */}
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
            <button onClick={() => setActiveSection("reviews")}>Reseñas</button>
          </li>
        </ul>
      </nav>
      {/* Usa la prop handleLogout pasada desde AdminDashboard */}
      <button onClick={handleLogout} className="logout-btn">
        Cerrar Sesión
      </button>
      {/* O, si handleLogout se maneja localmente en Sidebar: */}
      {/* <button onClick={handleLocalLogout} className="logout-btn">
        Cerrar Sesión
      </button> */}
    </aside>
  );
};

export default Sidebar;
