import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const UserFormModal = ({
  isOpen,
  onRequestClose,
  onSave,
  initialData,
  roles,
  restrictAdminActions = false, // Nueva prop
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
        contrasena: "", // Por seguridad no precargamos contraseña
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
        id_rol: restrictAdminActions
          ? "3"
          : roles.length > 0
          ? roles[0].id_rol
          : "", // Si es operador de tráfico, se asigna 'Cliente' como predeterminado
        estado: "Activo",
      });
    }
  }, [initialData, roles, restrictAdminActions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData && !formData.contrasena) {
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
      className="user-form-modal"
      overlayClassName="user-form-overlay"
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
            disabled={!!initialData} // No se edita email al modificar
          />
        </div>
        {!initialData && (
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
        {initialData && (
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
            {roles.map((role) => {
              const isAdminRole = role.nombre_rol === "Administrador";
              const disabled = restrictAdminActions && isAdminRole;
              return (
                <option
                  key={role.id_rol}
                  value={role.id_rol}
                  disabled={disabled}
                  title={
                    disabled
                      ? "No tienes permiso para asignar el rol Administrador"
                      : ""
                  }
                >
                  {role.nombre_rol}
                </option>
              );
            })}
          </select>
        </div>
        {initialData && (
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
