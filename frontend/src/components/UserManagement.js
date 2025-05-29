// frontend/src/components/UserManagement.js
import React, { useState, useEffect, useContext, useCallback } from "react"; // Importa useCallback
import userService from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import UserFormModal from "./UserFormModal";
import "./UserManagement.css";

// Configura el elemento root de la aplicación para el modal
import Modal from "react-modal"; // Asegúrate de importar Modal aquí también para configurar setAppElement
Modal.setAppElement("#root"); // Asume que tu index.html tiene <div id="root"></div>

const UserManagement = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  // Envuelve fetchUsers en useCallback
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await userService.getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(
        "Error al cargar los usuarios: " +
          (err.response?.data?.message || err.message)
      );
      toast.error("Error al cargar los usuarios.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]); // 'token' es una dependencia de fetchUsers

  // Envuelve fetchRoles en useCallback
  const fetchRoles = useCallback(async () => {
    if (!token) return;

    try {
      // Nota: Asegúrate que esta ruta /api/users/roles esté definida en tu backend/routes/user.routes.js
      // Por ejemplo: router.get("/roles", authMiddleware.verifyToken, adminAuth, userController.getAllRoles);
      const data = await userService.getAllRoles(token);
      setRoles(data);
    } catch (err) {
      toast.error("Error al cargar los roles.");
      console.error(err);
    }
  }, [token]); // 'token' es una dependencia de fetchRoles

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRoles();
    }
  }, [token, fetchUsers, fetchRoles]); // Las funciones ahora son estables gracias a useCallback

  const openCreateModal = () => {
    setCurrentSelectedUser(null);
    setModalIsOpen(true);
  };

  const openEditModal = (userToEdit) => {
    setCurrentSelectedUser(userToEdit);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentSelectedUser(null);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (currentSelectedUser) {
        await userService.updateUser(
          currentSelectedUser.id_usuario,
          userData,
          token
        );
        toast.success("Usuario actualizado con éxito");
      } else {
        await userService.createUser(userData, token);
        toast.success("Usuario creado con éxito");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        err.message;
      toast.error("Error al guardar el usuario: " + errorMessage);
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId, token);
        toast.success("Usuario eliminado con éxito");
        fetchUsers();
      } catch (err) {
        toast.error(
          "Error al eliminar el usuario: " +
            (err.response?.data?.message || err.message)
        );
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">Cargando usuarios...</div>
    );
  }

  if (error) {
    return (
      <div className="user-management-container error-message">{error}</div>
    );
  }

  return (
    <div className="user-management-container">
      <h3>Gestión de Usuarios</h3>
      <button onClick={openCreateModal} className="add-user-button">
        Crear Nuevo Usuario
      </button>

      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.telefono}</td>
                <td>{u.rol}</td>
                <td>{u.estado}</td>
                <td>
                  <button
                    onClick={() => openEditModal(u)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id_usuario)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}

      <UserFormModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSave={handleSaveUser}
        initialData={currentSelectedUser}
        roles={roles}
      />
    </div>
  );
};

export default UserManagement;
