import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/clienteSidebar";
import userService from "../services/userService";
import { toast } from "react-toastify";
import "./ClientDashboard.css";
// Importa estilos comunes si es necesario

const ClientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    direccion_entrega: "",
    material_solicitado: "",
    cantidad_solicitada: "",
    fecha_entrega_estimada: "",
    notas_cliente: "",
  });
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createSolicitud(formData, user.token);
      toast.success("Solicitud creada con éxito");
      setFormData({
        direccion_entrega: "",
        material_solicitado: "",
        cantidad_solicitada: "",
        fecha_entrega_estimada: "",
        notas_cliente: "",
      });
    } catch (error) {
      setError("Error al crear la solicitud");
      toast.error("Error al crear la solicitud");
    }
  };

  return (
    <div className="client-dashboard-layout">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="client-content">
        <h1>Panel del Cliente</h1>
        <div className="section">
          <h3>Mi Perfil</h3>
          <p>Nombre: {user.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Teléfono: {user.telefono}</p>
          <p>Estado: {user.estado}</p>
        </div>
        <div className="section">
          <h3>Mis Solicitudes</h3>
          <p>No tienes solicitudes registradas.</p>
        </div>
        <div className="section">
          <h3>Crear Nueva Solicitud</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Dirección de Entrega:</label>
              <input
                type="text"
                name="direccion_entrega"
                value={formData.direccion_entrega}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Material Solicitado:</label>
              <input
                type="text"
                name="material_solicitado"
                value={formData.material_solicitado}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Cantidad Solicitada:</label>
              <input
                type="number"
                name="cantidad_solicitada"
                value={formData.cantidad_solicitada}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Entrega Estimada:</label>
              <input
                type="date"
                name="fecha_entrega_estimada"
                value={formData.fecha_entrega_estimada}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notas del Cliente:</label>
              <textarea
                name="notas_cliente"
                value={formData.notas_cliente}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Crear Solicitud</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
