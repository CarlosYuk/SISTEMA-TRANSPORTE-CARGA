// frontend/src/components/VehicleFormModal.js
import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { AuthContext } from "../context/AuthContext";
import vehicleService from "../services/vehicleService";
import { toast } from "react-toastify";


// ... (customStyles y Modal.setAppElement('#root'))
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f8f9fa",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};
const VehicleFormModal = ({
  isOpen,
  onRequestClose,
  onVehicleSaved,
  initialData,
}) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    anio: "",
    capacidad_carga: "",
    tipo_combustible: "Gasolina",
    estado_vehiculo: "Disponible",
    nombre_conductor: "",
    imagen: null,
    imagen_url: "",
    ultima_ubicacion: "", // Nuevo campo
    fecha_ultima_ubicacion: "", // Nuevo campo
    consumo_combustible: "", // Nuevo campo
    ultima_revision: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          placa: initialData.placa || "",
          marca: initialData.marca || "",
          modelo: initialData.modelo || "",
          anio: initialData.anio || "",
          capacidad_carga: initialData.capacidad_carga || "",
          tipo_combustible: initialData.tipo_combustible || "Gasolina",
          estado_vehiculo: initialData.estado_vehiculo || "Disponible",
          nombre_conductor: initialData.nombre_conductor || "",
          imagen: null, // No precargamos el archivo, solo la URL
          imagen_url: initialData.imagen_url || "",
          ultima_ubicacion: initialData.ultima_ubicacion || "", // Cargar valor existente
          // Formatear las fechas para el campo de entrada 'date' o 'datetime-local'
          fecha_ultima_ubicacion: initialData.fecha_ultima_ubicacion
            ? new Date(initialData.fecha_ultima_ubicacion)
                .toISOString()
                .slice(0, 16)
            : "", // Usar slice para datetime-local
          consumo_combustible: initialData.consumo_combustible || "", // Cargar valor existente
          ultima_revision: initialData.ultima_revision
            ? new Date(initialData.ultima_revision).toISOString().split("T")[0]
            : "", // Usar split para date
        });
      } else {
        setFormData({
          placa: "",
          marca: "",
          modelo: "",
          anio: "",
          capacidad_carga: "",
          tipo_combustible: "Gasolina",
          estado_vehiculo: "Disponible",
          nombre_conductor: "",
          imagen: null,
          imagen_url: "",
          ultima_ubicacion: "",
          fecha_ultima_ubicacion: "",
          consumo_combustible: "",
          ultima_revision: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
    setErrors((prev) => ({ ...prev, imagen: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.placa) newErrors.placa = "La placa es obligatoria.";
    if (!formData.marca) newErrors.marca = "La marca es obligatoria.";
    if (!formData.modelo) newErrors.modelo = "El modelo es obligatorio.";

    if (
      formData.anio &&
      (isNaN(formData.anio) ||
        formData.anio < 1900 ||
        formData.anio > new Date().getFullYear() + 1)
    ) {
      newErrors.anio =
        "El año debe ser un número válido entre 1900 y el año actual + 1.";
    }
    if (
      formData.capacidad_carga &&
      (isNaN(parseFloat(formData.capacidad_carga)) ||
        parseFloat(formData.capacidad_carga) <= 0)
    ) {
      newErrors.capacidad_carga =
        "La capacidad de carga debe ser un número positivo.";
    }
    if (
      formData.consumo_combustible &&
      isNaN(parseFloat(formData.consumo_combustible))
    ) {
      newErrors.consumo_combustible =
        "El consumo de combustible debe ser un número.";
    }

    if (!formData.tipo_combustible)
      newErrors.tipo_combustible = "El tipo de combustible es obligatorio.";
    if (!formData.estado_vehiculo)
      newErrors.estado_vehiculo = "El estado del vehículo es obligatorio.";

    if (!initialData && !formData.imagen) {
      newErrors.imagen = "Debe seleccionar una imagen para el vehículo.";
    }
    if (formData.imagen && !formData.imagen.type.startsWith("image/")) {
      newErrors.imagen = "Solo se permiten archivos de imagen.";
    }
    if (
      formData.nombre_conductor &&
      typeof formData.nombre_conductor !== "string"
    ) {
      newErrors.nombre_conductor = "El nombre del conductor debe ser texto.";
    }
    if (
      formData.ultima_revision &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.ultima_revision)
    ) {
      newErrors.ultima_revision =
        "La fecha de última revisión debe tener formato YYYY-MM-DD.";
    }
    if (
      formData.fecha_ultima_ubicacion &&
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
        formData.fecha_ultima_ubicacion
      ) &&
      formData.fecha_ultima_ubicacion !== ""
    ) {
      newErrors.fecha_ultima_ubicacion =
        "La fecha de última ubicación debe tener formato YYYY-MM-DDTHH:mm o estar vacía.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrige los errores del formulario.");
      return;
    }

    const dataToSend = new FormData();
    for (const key in formData) {
      if (key === "imagen" && formData.imagen) {
        dataToSend.append(key, formData.imagen);
      } else if (
        key === "ultima_revision" ||
        key === "fecha_ultima_ubicacion" ||
        key === "capacidad_carga" ||
        key === "consumo_combustible" ||
        key === "anio"
      ) {
        // Envía la fecha/número como una cadena vacía si no hay valor,
        // el backend lo interpretará como NULL.
        dataToSend.append(key, formData[key] || "");
      } else if (
        key !== "imagen_url" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        dataToSend.append(key, formData[key]);
      }
    }

    try {
      if (initialData) {
        await vehicleService.updateVehicle(
          initialData.id_vehiculo,
          dataToSend,
          token
        );
        toast.success("Vehículo actualizado exitosamente.");
      } else {
        await vehicleService.createVehicle(dataToSend, token);
        toast.success("Vehículo agregado exitosamente.");
      }
      onVehicleSaved();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const errorMessage = err.response?.data?.message || err.message;

      if (serverErrors && Array.isArray(serverErrors)) {
        const fieldErrors = {};
        serverErrors.forEach((error) => {
          if (error.field) {
            fieldErrors[error.field] = error.message;
          }
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        toast.error("Errores de validación: " + errorMessage);
      } else {
        toast.error("Error al guardar el vehículo: " + errorMessage);
      }
      console.error("Error saving vehicle:", err.response || err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel={initialData ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
    >
      <div className="modal-header">
        <h2>{initialData ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}</h2>
        <button onClick={onRequestClose} className="close-modal-btn">
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="vehicle-form">
        {/* CAMPOS EXISTENTES */}
        <div className="form-group">
          <label htmlFor="placa">Placa:</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            className={errors.placa ? "input-error" : ""}
          />
          {errors.placa && (
            <span className="error-message-inline">{errors.placa}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className={errors.marca ? "input-error" : ""}
          />
          {errors.marca && (
            <span className="error-message-inline">{errors.marca}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={errors.modelo ? "input-error" : ""}
          />
          {errors.modelo && (
            <span className="error-message-inline">{errors.modelo}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="anio">Año:</label>
          <input
            type="number"
            id="anio"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            className={errors.anio ? "input-error" : ""}
          />
          {errors.anio && (
            <span className="error-message-inline">{errors.anio}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="capacidad_carga">Capacidad de Carga (kg):</label>
          <input
            type="number"
            id="capacidad_carga"
            name="capacidad_carga"
            step="0.01"
            value={formData.capacidad_carga}
            onChange={handleChange}
            className={errors.capacidad_carga ? "input-error" : ""}
          />
          {errors.capacidad_carga && (
            <span className="error-message-inline">
              {errors.capacidad_carga}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tipo_combustible">Tipo de Combustible:</label>
          <select
            id="tipo_combustible"
            name="tipo_combustible"
            value={formData.tipo_combustible}
            onChange={handleChange}
          >
            <option value="Gasolina">Gasolina</option>
            <option value="Diésel">Diésel</option>
            <option value="Eléctrico">Eléctrico</option>
            <option value="GLP">GLP</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado_vehiculo">Estado del Vehículo:</label>
          <select
            id="estado_vehiculo"
            name="estado_vehiculo"
            value={formData.estado_vehiculo}
            onChange={handleChange}
          >
            <option value="Disponible">Disponible</option>
            <option value="En Ruta">En Ruta</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nombre_conductor">Nombre del Conductor:</label>
          <input
            type="text"
            id="nombre_conductor"
            name="nombre_conductor"
            value={formData.nombre_conductor}
            onChange={handleChange}
            className={errors.nombre_conductor ? "input-error" : ""}
          />
          {errors.nombre_conductor && (
            <span className="error-message-inline">
              {errors.nombre_conductor}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ultima_revision">Última Revisión:</label>
          <input
            type="date"
            id="ultima_revision"
            name="ultima_revision"
            value={formData.ultima_revision}
            onChange={handleChange}
            className={errors.ultima_revision ? "input-error" : ""}
          />
          {errors.ultima_revision && (
            <span className="error-message-inline">
              {errors.ultima_revision}
            </span>
          )}
        </div>

        {/* NUEVOS CAMPOS A AGREGAR */}
        <div className="form-group">
          <label htmlFor="consumo_combustible">
            Consumo de Combustible (L/100km):
          </label>
          <input
            type="number"
            id="consumo_combustible"
            name="consumo_combustible"
            step="0.01"
            value={formData.consumo_combustible}
            onChange={handleChange}
            className={errors.consumo_combustible ? "input-error" : ""}
          />
          {errors.consumo_combustible && (
            <span className="error-message-inline">
              {errors.consumo_combustible}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ultima_ubicacion">
            Última Ubicación (Coordenadas/Dirección):
          </label>
          <input
            type="text"
            id="ultima_ubicacion"
            name="ultima_ubicacion"
            value={formData.ultima_ubicacion}
            onChange={handleChange}
            className={errors.ultima_ubicacion ? "input-error" : ""}
          />
          {errors.ultima_ubicacion && (
            <span className="error-message-inline">
              {errors.ultima_ubicacion}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fecha_ultima_ubicacion">
            Fecha Última Ubicación:
          </label>
          <input
            type="datetime-local"
            id="fecha_ultima_ubicacion"
            name="fecha_ultima_ubicacion"
            value={formData.fecha_ultima_ubicacion}
            onChange={handleChange}
            className={errors.fecha_ultima_ubicacion ? "input-error" : ""}
          />
          {errors.fecha_ultima_ubicacion && (
            <span className="error-message-inline">
              {errors.fecha_ultima_ubicacion}
            </span>
          )}
        </div>

        {/* IMAGEN DEL VEHÍCULO */}
        <div className="form-group">
          <label htmlFor="imagen">Imagen del Vehículo:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.imagen ? "input-error" : ""}
          />
          {errors.imagen && (
            <span className="error-message-inline">{errors.imagen}</span>
          )}
          {formData.imagen_url && !formData.imagen && (
            <div className="current-image-preview">
              <p>Imagen actual:</p>
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${formData.imagen_url}`}
                alt="Imagen actual del vehículo"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  marginTop: "10px",
                }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {initialData ? "Actualizar Vehículo" : "Agregar Vehículo"}
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleFormModal;
