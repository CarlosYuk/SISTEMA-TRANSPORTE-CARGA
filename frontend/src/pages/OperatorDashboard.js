import React, { useState, useContext, useEffect } from "react";
import OperatorSidebar from "../components/OperatorSidebar";
import { AuthContext } from "../context/AuthContext";
import UserManagement from "../components/UserManagement";
import VehicleManagement from "../components/VehicleManagement";
import solicitudService from "../services/solicitudService"; // Servicio de solicitudes
import vehicleService from "../services/vehicleService"; // Servicio de vehículos
import routeService from "../services/routeService"; // Servicio de rutas

const OperatorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [solicitudes, setSolicitudes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Cargar datos de solicitudes, vehículos y rutas cuando el componente se monta
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Obtener solicitudes
        const solicitudesData = await solicitudService.getSolicitudes(token);
        setSolicitudes(solicitudesData);

        // Obtener vehículos
        const vehiclesData = await vehicleService.getAllVehicles(token);
        setVehicles(vehiclesData);

        // Obtener rutas
        const routesData = await routeService.getAllRoutes(token);
        setRoutes(routesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    // Solo cargar datos si el usuario es un operador de tráfico
    if (user && user.rol === "Operador de Tráfico") {
      loadData();
    }
  }, [user]); // Se ejecuta cuando cambia el usuario

  // Maneja el logout
  const handleLogout = () => {
    logout();
  };

  // Solo los operadores de tráfico pueden acceder al panel
  if (!user || user.rol !== "Operador de Tráfico") {
    return (
      <p>
        Acceso denegado. Solo los operadores de tráfico pueden ver esta página.
      </p>
    );
  }

  // Función para asignar un vehículo y una ruta a una solicitud
  const handleAssignVehicleAndRoute = async (solicitudId) => {
    if (!selectedVehicle || !selectedRoute) {
      alert("Por favor, selecciona un vehículo y una ruta.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await solicitudService.updateSolicitud(
        solicitudId,
        selectedVehicle,
        selectedRoute,
        token
      );
      alert(response.message);
      // Actualizar las solicitudes después de la asignación
      const updatedSolicitudes = await solicitudService.getSolicitudes(token);
      setSolicitudes(updatedSolicitudes);
      // Limpiar las selecciones después de la asignación exitosa
      setSelectedVehicle(null);
      setSelectedRoute(null);
    } catch (error) {
      console.error("Error al asignar vehículo y ruta:", error);
      alert("Hubo un error al asignar el vehículo y la ruta.");
    }
  };

  // Renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>Aquí verás estadísticas y resúmenes del sistema.</p>
          </div>
        );
      case "users":
        return <UserManagement restrictAdminActions={true} />;
      case "vehicles":
        return <VehicleManagement />;
      case "requests":
        return (
          <div>
            <h3>Solicitudes de Clientes</h3>
            {solicitudes.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dirección</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Fecha Estimada</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id_solicitud}>
                      <td>{solicitud.id_solicitud}</td>
                      <td>{solicitud.direccion_entrega}</td>
                      <td>{solicitud.material_solicitado}</td>
                      <td>{solicitud.cantidad_solicitada}</td>
                      <td>{solicitud.fecha_entrega_estimada}</td>
                      <td>
                        <select
                          value={selectedVehicle || ""}
                          onChange={(e) => setSelectedVehicle(e.target.value)}
                        >
                          <option value="">Seleccionar Vehículo</option>
                          {vehicles.map((vehicle) => (
                            <option
                              key={vehicle.id_vehiculo}
                              value={vehicle.id_vehiculo}
                            >
                              {vehicle.placa}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedRoute || ""}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                        >
                          <option value="">Seleccionar Ruta</option>
                          {routes.map((route) => (
                            <option key={route.id_ruta} value={route.id_ruta}>
                              {route.nombre_ruta}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleAssignVehicleAndRoute(solicitud.id_solicitud)
                          }
                        >
                          Asignar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No tienes solicitudes registradas.</p>
            )}
          </div>
        );
      default:
        return (
          <div className="dashboard-summary">
            <h3>Resumen General</h3>
            <p>Selecciona una opción del menú.</p>
          </div>
        );
    }
  };

  return (
    <div
      className="operator-dashboard-layout"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      <OperatorSidebar
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        user={user}
      />
      <main
        className="operator-content"
        style={{ flexGrow: 1, padding: "30px", backgroundColor: "#f5f6fa" }}
      >
        <h1>Panel del Operador de Rutas</h1>
        <p>
          Bienvenido, {user.nombre} (Rol: {user.rol})
        </p>
        {renderContent()}
      </main>
    </div>
  );
};

export default OperatorDashboard;
