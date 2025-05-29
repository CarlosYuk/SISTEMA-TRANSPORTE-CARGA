// frontend/src/components/UserFormModal.js
import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Asegúrate de tener instalado react-modal

// Configura el elemento root de la aplicación para el modal
Modal.setAppElement("#root"); // Asume que tu index.html tiene <div id="root"></div>

const UserFormModal = ({
  isOpen,
  onRequestClose,
  onSave,
  initialData,
  roles,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    telefono: "",
    id_rol: "",
    estado: "Activo",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        email: initialData.email || "",
        contrasena: "", // No precargar la contraseña por seguridad
        telefono: initialData.telefono || "",
        id_rol: initialData.id_rol || "",
        estado: initialData.estado || "Activo",
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        contrasena: "",
        telefono: "",
        id_rol: roles.length > 0 ? roles[0].id_rol : "", // Valor por defecto si hay roles
        estado: "Activo",
      });
    }
  }, [initialData, roles]); // Añadir roles como dependencia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData && !formData.contrasena) {
      // Si estamos editando y no se proporciona nueva contraseña, eliminarla del objeto
      const { contrasena, ...dataToSend } = formData;
      onSave(dataToSend);
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={initialData ? "Editar Usuario" : "Crear Usuario"}
      className="user-form-modal" // Clases CSS para el modal
      overlayClassName="user-form-overlay" // Clases CSS para el overlay
    >
      <h3>{initialData ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!initialData} // Email no editable si se está editando
          />
        </div>
        {!initialData && ( // Contraseña solo requerida al crear
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required={!initialData}
            />
          </div>
        )}
        {initialData && ( // Opción de cambiar contraseña al editar
          <div className="form-group">
            <label>Nueva Contraseña (opcional):</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>
        )}
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id_rol} value={role.id_rol}>
                {role.nombre_rol}
              </option>
            ))}
          </select>
        </div>
        {initialData && ( // Estado solo visible al editar
          <div className="form-group">
            <label>Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        )}
        <div className="modal-actions">
          <button type="submit" className="save-button">
            {initialData ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
