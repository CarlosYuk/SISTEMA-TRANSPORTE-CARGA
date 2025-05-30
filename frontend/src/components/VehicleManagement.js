// frontend/src/components/VehicleManagement.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import vehicleService from "../services/vehicleService";
import { toast } from "react-toastify";
import VehicleFormModal from "./VehicleFormModal";
import "./VehicleManagement.css";

const VehicleManagement = () => {
  const { token } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await vehicleService.getAllVehicles(token);
      if (Array.isArray(response.data)) {
        setVehicles(response.data);
      } else {
        console.warn("Formato inesperado en vehículos:", response.data);
        setVehicles([]);
      }
    } catch (error) {
      console.error(
        "Error al obtener vehículos:",
        error.response?.data?.message || error.message
      );
      toast.error("Error al cargar vehículos.");
      setVehicles([]);
    }
  }, [token]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles(token);
        setVehicles(data);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    if (token) fetchVehicles();
  });

  const handleCreateClick = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (vehicleId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")
    ) {
      try {
        await vehicleService.deleteVehicle(vehicleId, token);
        toast.success("Vehículo eliminado exitosamente.");
        fetchVehicles();
      } catch (error) {
        console.error(
          "Error al eliminar vehículo:",
          error.response?.data?.message || error.message
        );
        toast.error("Error al eliminar vehículo.");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleVehicleSaved = () => {
    handleModalClose();
    fetchVehicles();
  };

  return (
    <div className="vehicle-management">
      <h2>Gestión de Vehículos</h2>
      <button onClick={handleCreateClick} className="btn btn-primary mb-3">
        Agregar Nuevo Vehículo
      </button>

      <VehicleFormModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onVehicleSaved={handleVehicleSaved}
        initialData={selectedVehicle}
      />

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Capacidad Carga</th>
              <th>Combustible</th>
              <th>Estado</th>
              <th>Conductor</th>
              <th>Última Revisión</th>
              <th>Consumo Combustible</th>
              <th>Última Ubicación</th>
              <th>Fecha Última Ubicación</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(vehicles) || vehicles.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center">
                  No hay vehículos registrados.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id_vehiculo}>
                  <td>{vehicle.id_vehiculo}</td>
                  <td>{vehicle.placa}</td>
                  <td>{vehicle.marca}</td>
                  <td>{vehicle.modelo}</td>
                  <td>{vehicle.anio}</td>
                  <td>{vehicle.capacidad_carga} kg</td>
                  <td>{vehicle.tipo_combustible}</td>
                  <td>{vehicle.estado_vehiculo}</td>
                  <td>{vehicle.nombre_conductor || "N/A"}</td>
                  <td>
                    {vehicle.ultima_revision
                      ? new Date(vehicle.ultima_revision).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{vehicle.consumo_combustible || "N/A"}</td>
                  <td>{vehicle.ultima_ubicacion || "N/A"}</td>
                  <td>
                    {vehicle.fecha_ultima_ubicacion
                      ? new Date(
                          vehicle.fecha_ultima_ubicacion
                        ).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {vehicle.imagen_url ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${vehicle.imagen_url}`}
                        alt="Vehículo"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No disponible"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="btn btn-sm btn-info me-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vehicle.id_vehiculo)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleManagement;
