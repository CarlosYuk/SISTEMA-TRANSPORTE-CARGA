// Ejemplo: frontend/src/pages/AdminDashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // O a la home, según tu preferencia
  };

  return (
    <div>
      <h1>Panel de Administrador</h1>
      <p>Bienvenido, {user ? user.nombre + ' ' + user.apellido : 'Usuario'} (Rol: {user ? user.rol : 'Desconocido'})</p>
      <p>Tu email: {user ? user.email : ''}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Aquí el contenido específico del administrador */}
    </div>
  );
}
export default AdminDashboard;