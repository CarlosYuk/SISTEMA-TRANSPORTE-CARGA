import React, { useState, useEffect, useContext } from "react";
import userService from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import UserFormModal from "./UserFormModal";
import "./UserManagement.css";

import Modal from "react-modal";
Modal.setAppElement("#root");

const UserManagement = ({ restrictAdminActions = false }) => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  // DEBUGGING: Agregar logs detallados
  console.log("UserManagement - Token:", token ? "Present" : "Missing");
  console.log("UserManagement - User:", user);
  console.log("UserManagement - restrictAdminActions:", restrictAdminActions);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.log("❌ No token available");
        setLoading(false);
        setError("No se encontró token de autenticación");
        return;
      }

      console.log("🚀 Starting data fetch...");
      console.log("Token details:", {
        exists: !!token,
        type: typeof token,
        length: token?.length,
        preview: token?.substring(0, 20) + "...",
      });

      try {
        setLoading(true);
        setError(null);

        console.log("📡 Fetching users...");
        const usersData = await userService.getAllUsers(token);
        console.log("✅ Users fetched successfully:", usersData?.length || 0);
        setUsers(usersData || []);

        console.log("📡 Fetching roles...");
        const rolesData = await userService.getAllRoles(token);
        console.log("✅ Roles fetched successfully:", rolesData);
        setRoles(rolesData || []);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
        });

        const errorMessage = err.response?.data?.message || err.message;
        setError(`Error al cargar los datos: ${errorMessage}`);

        // Mostrar error específico según el código
        if (err.response?.status === 401) {
          toast.error("Token de autenticación inválido o expirado");
        } else if (err.response?.status === 403) {
          toast.error("No tienes permisos para acceder a esta información");
        } else if (err.response?.status === 404) {
          toast.error(
            "Endpoint no encontrado - verifica la configuración del servidor"
          );
        } else {
          toast.error("Error al cargar los datos: " + errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Solo token como dependencia

  // Helper functions
  const getAdminRole = () => {
    return roles.find((r) => r.nombre_rol === "Administrador");
  };

  const getClientRole = () => {
    return roles.find((r) => r.nombre_rol === "Cliente");
  };

  const isAdminUser = (user) => {
    return user.rol === "Administrador" || user.nombre_rol === "Administrador";
  };

  const openCreateModal = () => {
    console.log("🔓 Opening create modal");
    setCurrentSelectedUser(null);
    setModalIsOpen(true);
  };

  const openEditModal = (userToEdit) => {
    console.log("🔓 Opening edit modal for user:", userToEdit);

    if (restrictAdminActions && isAdminUser(userToEdit)) {
      console.log("❌ Edit blocked - admin user restriction");
      toast.error(
        "No tienes permisos para modificar usuarios administradores."
      );
      return;
    }
    setCurrentSelectedUser(userToEdit);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("🔒 Closing modal");
    setModalIsOpen(false);
    setCurrentSelectedUser(null);
  };

  const validateUserPermissions = (userData) => {
    console.log("🛡️ Validating permissions for:", userData);

    if (!restrictAdminActions) {
      console.log("✅ No restrictions - admin user");
      return { isValid: true };
    }

    const adminRole = getAdminRole();
    const clientRole = getClientRole();

    console.log("Available roles:", { adminRole, clientRole });

    if (userData.id_rol === adminRole?.id_rol) {
      console.log("❌ Blocked - trying to create/edit admin user");
      return {
        isValid: false,
        message:
          "No tienes permisos para crear/modificar usuarios administradores.",
      };
    }

    if (currentSelectedUser && isAdminUser(currentSelectedUser)) {
      console.log("❌ Blocked - editing admin user");
      return {
        isValid: false,
        message: "No tienes permisos para modificar usuarios administradores.",
      };
    }

    if (!currentSelectedUser && userData.id_rol !== clientRole?.id_rol) {
      console.log("❌ Blocked - can only create clients");
      return {
        isValid: false,
        message: "Solo puedes crear usuarios con el rol 'Cliente'.",
      };
    }

    console.log("✅ Permissions validated");
    return { isValid: true };
  };

  const handleSaveUser = async (userData) => {
    console.log("💾 Saving user:", userData);

    try {
      const validation = validateUserPermissions(userData);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      if (currentSelectedUser) {
        console.log("📝 Updating existing user");
        await userService.updateUser(
          currentSelectedUser.id_usuario,
          userData,
          token
        );
        toast.success("Usuario actualizado con éxito");
      } else {
        console.log("➕ Creating new user");
        await userService.createUser(userData, token);
        toast.success("Usuario creado con éxito");
      }

      closeModal();

      // Refetch data
      console.log("🔄 Refetching users...");
      const usersData = await userService.getAllUsers(token);
      setUsers(usersData || []);
    } catch (err) {
      console.error("❌ Error saving user:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        err.message;
      toast.error("Error al guardar el usuario: " + errorMessage);
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    console.log("🗑️ Deleting user:", { userId, userRole });

    if (restrictAdminActions && userRole === "Administrador") {
      console.log("❌ Delete blocked - admin user");
      toast.error("No tienes permisos para eliminar usuarios administradores.");
      return;
    }

    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId, token);
        toast.success("Usuario eliminado con éxito");

        // Refetch users
        const usersData = await userService.getAllUsers(token);
        setUsers(usersData || []);
      } catch (err) {
        console.error("❌ Error deleting user:", err);
        toast.error(
          "Error al eliminar el usuario: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="user-management-container">
        <p>Cargando usuarios...</p>
        <small>Token: {token ? "✅ Presente" : "❌ Ausente"}</small>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="user-management-container error-message">
        <h3>Error al cargar datos</h3>
        <p>{error}</p>
        <details>
          <summary>Información de debug</summary>
          <pre>
            {JSON.stringify(
              {
                hasToken: !!token,
                tokenType: typeof token,
                userRole: user?.rol,
                restrictAdminActions,
              },
              null,
              2
            )}
          </pre>
        </details>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }

  // Determine available roles
  const getAvailableRoles = () => {
    console.log("🎭 Getting available roles. All roles:", roles);

    if (!restrictAdminActions) {
      return roles;
    }

    const filtered = roles.filter((r) => r.nombre_rol === "Cliente");
    console.log("🎭 Filtered roles for operator:", filtered);
    return filtered;
  };

  const filteredRoles = getAvailableRoles();

  return (
    <div className="user-management-container">
      <h3>Gestión de Usuarios</h3>

      {/* Debug info */}
      <details style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
        <summary>Debug Info</summary>
        <pre>
          {JSON.stringify(
            {
              usersCount: users.length,
              rolesCount: roles.length,
              filteredRolesCount: filteredRoles.length,
              restrictAdminActions,
              userRole: user?.rol,
            },
            null,
            2
          )}
        </pre>
      </details>

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
            {users.map((user) => {
              const isAdmin = isAdminUser(user);
              const canEdit = !restrictAdminActions || !isAdmin;
              const canDelete = !restrictAdminActions || !isAdmin;

              return (
                <tr key={user.id_usuario}>
                  <td>{user.id_usuario}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono}</td>
                  <td>
                    {user.rol}
                    {isAdmin && restrictAdminActions && (
                      <small style={{ color: "orange" }}> (Restringido)</small>
                    )}
                  </td>
                  <td>{user.estado}</td>
                  <td>
                    <button
                      onClick={() => openEditModal(user)}
                      className={`edit-button ${!canEdit ? "disabled" : ""}`}
                      disabled={!canEdit}
                      title={
                        !canEdit
                          ? "No tienes permisos para editar este usuario"
                          : "Editar usuario"
                      }
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteUser(user.id_usuario, user.rol)
                      }
                      className={`delete-button ${
                        !canDelete ? "disabled" : ""
                      }`}
                      disabled={!canDelete}
                      title={
                        !canDelete
                          ? "No tienes permisos para eliminar este usuario"
                          : "Eliminar usuario"
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
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
