import React, { useState, useEffect, useContext, useCallback } from "react";
import userService from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import UserFormModal from "./UserFormModal";
import "./UserManagement.css";

import Modal from "react-modal";
Modal.setAppElement("#root");

const UserManagement = ({ restrictAdminActions = false }) => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

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
  }, [token]);

  const fetchRoles = useCallback(async () => {
    if (!token) return;
    try {
      const data = await userService.getAllRoles(token);
      setRoles(data);
    } catch (err) {
      toast.error("Error al cargar los roles.");
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRoles();
    }
  }, [token, fetchUsers, fetchRoles]);

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
        // Si restrictAdminActions y se intenta modificar rol a administrador o modificar usuario administrador, bloquear
        if (
          restrictAdminActions &&
          (userData.id_rol ===
            roles.find((r) => r.nombre_rol === "Administrador")?.id_rol ||
            currentSelectedUser.nombre_rol === "Administrador")
        ) {
          toast.error(
            "No tienes permisos para modificar usuarios administradores."
          );
          return;
        }
        await userService.updateUser(
          currentSelectedUser.id_usuario,
          userData,
          token
        );
        toast.success("Usuario actualizado con éxito");
      } else {
        // Si restrictAdminActions y se intenta crear usuario con rol administrador, bloquear
        if (
          restrictAdminActions &&
          userData.id_rol ===
            roles.find((r) => r.nombre_rol === "Administrador")?.id_rol
        ) {
          toast.error(
            "No tienes permisos para crear usuarios administradores."
          );
          return;
        }

        // Si el rol es "Operador de Tráfico", solo puede crear usuarios con el rol de "Cliente"
        if (restrictAdminActions && userData.id_rol !== "Cliente") {
          toast.error("Solo puedes crear usuarios con el rol 'Cliente'.");
          return;
        }

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

  const handleDeleteUser = async (userId, userRole) => {
    if (restrictAdminActions && userRole === "Administrador") {
      toast.error("No tienes permisos para eliminar usuarios administradores.");
      return;
    }
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

  // Filtrar roles para formulario si restrictAdminActions (no mostrar "Administrador")
  const filteredRoles = restrictAdminActions
    ? roles.filter((r) => r.nombre_rol !== "Administrador")
    : roles;

  return (
    <div className="user-management-container">
      <h3>Gestión de Usuarios</h3>
      {/* Solo mostrar botón crear si no restringido o mostrarlo con roles filtrados */}
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
                <td>{u.rol}</td> {/* Aquí se muestra el rol */}
                <td>{u.estado}</td>
                <td>
                  <button
                    onClick={() => openEditModal(u)}
                    className="edit-button"
                    disabled={restrictAdminActions && u.rol === "Administrador"}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id_usuario, u.rol)}
                    className="delete-button"
                    disabled={restrictAdminActions && u.rol === "Administrador"}
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
        roles={filteredRoles}
      />
    </div>
  );
};

export default UserManagement;
