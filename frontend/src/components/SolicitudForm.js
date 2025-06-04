import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import solicitudService from "../services/solicitudService";
import { toast } from "react-toastify";

const CreateSolicitudForm = ({ onSolicitudCreated }) => {
  const { token, user } = useContext(AuthContext); // Obtener token del contexto
  const [formData, setFormData] = useState({
    direccion_entrega: "",
    material_solicitado: "",
    cantidad_solicitada: "",
    fecha_entrega_estimada: "",
    notas_cliente: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("CreateSolicitudForm - User:", user);
  console.log("CreateSolicitudForm - Token:", token ? "Present" : "Missing");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar dirección de entrega
    if (!formData.direccion_entrega.trim()) {
      newErrors.direccion_entrega = "La dirección de entrega es requerida";
    } else if (formData.direccion_entrega.trim().length < 10) {
      newErrors.direccion_entrega =
        "La dirección debe tener al menos 10 caracteres";
    }

    // Validar material solicitado
    if (!formData.material_solicitado.trim()) {
      newErrors.material_solicitado = "El material solicitado es requerido";
    } else if (formData.material_solicitado.trim().length < 3) {
      newErrors.material_solicitado =
        "El material debe tener al menos 3 caracteres";
    }

    // Validar cantidad
    const cantidad = parseFloat(formData.cantidad_solicitada);
    if (!formData.cantidad_solicitada) {
      newErrors.cantidad_solicitada = "La cantidad es requerida";
    } else if (isNaN(cantidad) || cantidad <= 0) {
      newErrors.cantidad_solicitada =
        "La cantidad debe ser un número mayor a 0";
    } else if (cantidad > 10000) {
      newErrors.cantidad_solicitada =
        "La cantidad no puede exceder 10,000 unidades";
    }

    // Validar fecha de entrega
    if (!formData.fecha_entrega_estimada) {
      newErrors.fecha_entrega_estimada =
        "La fecha de entrega estimada es requerida";
    } else {
      const fechaSeleccionada = new Date(formData.fecha_entrega_estimada);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < hoy) {
        newErrors.fecha_entrega_estimada =
          "La fecha de entrega no puede ser en el pasado";
      }

      // Validar que no sea muy lejana (máximo 1 año)
      const unAnoMasTarde = new Date();
      unAnoMasTarde.setFullYear(unAnoMasTarde.getFullYear() + 1);
      if (fechaSeleccionada > unAnoMasTarde) {
        newErrors.fecha_entrega_estimada =
          "La fecha de entrega no puede ser mayor a un año";
      }
    }

    // Validar notas (opcional pero con límite)
    if (formData.notas_cliente && formData.notas_cliente.length > 500) {
      newErrors.notas_cliente = "Las notas no pueden exceder 500 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submitting solicitud form...");

    setLoading(true);
    setErrors({});

    try {
      // Validar formulario
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        console.log("❌ Validation errors:", validationErrors);
        setErrors(validationErrors);
        toast.error("Por favor, corrige los errores en el formulario");
        return;
      }

      // Verificar autenticación
      if (!token) {
        console.log("❌ No token available");
        toast.error(
          "No se encontró token de autenticación. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      if (!user) {
        console.log("❌ No user data available");
        toast.error(
          "No se encontraron datos del usuario. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      // Preparar datos para envío
      const solicitudData = {
        ...formData,
        cantidad_solicitada: parseFloat(formData.cantidad_solicitada),
        // Agregar datos del usuario si son necesarios
        id_usuario: user.id_usuario || user.id,
      };

      console.log("📤 Sending solicitud data:", solicitudData);

      // Crear solicitud
      const result = await solicitudService.createSolicitud(
        solicitudData,
        token
      );

      console.log("✅ Solicitud created successfully:", result);
      toast.success("Solicitud creada exitosamente");

      // Limpiar formulario
      setFormData({
        direccion_entrega: "",
        material_solicitado: "",
        cantidad_solicitada: "",
        fecha_entrega_estimada: "",
        notas_cliente: "",
      });

      // Callback para actualizar la lista de solicitudes
      if (onSolicitudCreated) {
        onSolicitudCreated(result);
      }
    } catch (err) {
      console.error("❌ Error creating solicitud:", err);

      let errorMessage =
        "Error al crear la solicitud. Por favor, intenta nuevamente.";

      if (err.response) {
        const { status, data } = err.response;
        console.error("Error response:", { status, data });

        switch (status) {
          case 400:
            errorMessage =
              data.message ||
              "Datos inválidos. Verifica la información ingresada.";
            break;
          case 401:
            errorMessage =
              "Sesión expirada. Por favor, inicia sesión nuevamente.";
            break;
          case 403:
            errorMessage = "No tienes permisos para crear solicitudes.";
            break;
          case 500:
            errorMessage = "Error interno del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = data.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  // Calcular fecha máxima (1 año desde hoy)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="create-solicitud-container">
      <form onSubmit={handleSubmit} className="create-solicitud-form">
        <h3>Crear Nueva Solicitud</h3>

        {/* Información del usuario */}
        {user && (
          <div className="user-info">
            <p>
              <strong>Usuario:</strong> {user.nombre} {user.apellido}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="direccion_entrega">
            Dirección de Entrega <span className="required">*</span>
          </label>
          <input
            type="text"
            id="direccion_entrega"
            name="direccion_entrega"
            value={formData.direccion_entrega}
            onChange={handleChange}
            className={errors.direccion_entrega ? "error" : ""}
            disabled={loading}
            placeholder="Ingrese la dirección completa de entrega"
            maxLength={200}
          />
          {errors.direccion_entrega && (
            <span className="error-text">{errors.direccion_entrega}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="material_solicitado">
            Material Solicitado <span className="required">*</span>
          </label>
          <input
            type="text"
            id="material_solicitado"
            name="material_solicitado"
            value={formData.material_solicitado}
            onChange={handleChange}
            className={errors.material_solicitado ? "error" : ""}
            disabled={loading}
            placeholder="Especifique el tipo de material requerido"
            maxLength={100}
          />
          {errors.material_solicitado && (
            <span className="error-text">{errors.material_solicitado}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cantidad_solicitada">
            Cantidad Solicitada <span className="required">*</span>
          </label>
          <input
            type="number"
            id="cantidad_solicitada"
            name="cantidad_solicitada"
            value={formData.cantidad_solicitada}
            onChange={handleChange}
            className={errors.cantidad_solicitada ? "error" : ""}
            disabled={loading}
            placeholder="Cantidad en unidades"
            min="0.01"
            max="10000"
            step="0.01"
          />
          {errors.cantidad_solicitada && (
            <span className="error-text">{errors.cantidad_solicitada}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fecha_entrega_estimada">
            Fecha de Entrega Estimada <span className="required">*</span>
          </label>
          <input
            type="date"
            id="fecha_entrega_estimada"
            name="fecha_entrega_estimada"
            value={formData.fecha_entrega_estimada}
            onChange={handleChange}
            className={errors.fecha_entrega_estimada ? "error" : ""}
            disabled={loading}
            min={today}
            max={maxDateString}
          />
          {errors.fecha_entrega_estimada && (
            <span className="error-text">{errors.fecha_entrega_estimada}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notas_cliente">
            Notas Adicionales
            <span className="optional"> (Opcional)</span>
          </label>
          <textarea
            id="notas_cliente"
            name="notas_cliente"
            value={formData.notas_cliente}
            onChange={handleChange}
            className={errors.notas_cliente ? "error" : ""}
            disabled={loading}
            placeholder="Información adicional o instrucciones especiales"
            rows={4}
            maxLength={500}
          />
          <small className="char-count">
            {formData.notas_cliente.length}/500 caracteres
          </small>
          {errors.notas_cliente && (
            <span className="error-text">{errors.notas_cliente}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : (
              "Crear Solicitud"
            )}
          </button>
        </div>

        <div className="form-note">
          <small>
            Los campos marcados con <span className="required">*</span> son
            obligatorios
          </small>
        </div>
      </form>
    </div>
  );
};

export default CreateSolicitudForm;
