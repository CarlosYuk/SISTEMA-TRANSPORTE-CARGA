// frontend/src/components/Sidebar.js

import React from "react";
import { Link } from "react-router-dom";
import "./clienteSidebar.css";

const Sidebar = ({ user, handleLogout }) => {
  return (
    <div className="sidebar">
      <h2>Panel del Cliente</h2>
      <p>Bienvenido, {user.nombre}!</p>
      <nav>
        <ul>
          <li>
            <Link to="/client">Mi Perfil</Link>
          </li>
          <li>
            <Link to="/client/solicitudes">Mis Solicitudes</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
