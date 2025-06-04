// solicitudService.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const solicitudService = {
  // Crear una nueva solicitud
  createSolicitud: async (solicitudData, token) => {
    try {
      // Validar datos antes de enviar
      if (
        !solicitudData.direccion_entrega ||
        !solicitudData.material_solicitado ||
        !solicitudData.cantidad_solicitada ||
        !solicitudData.fecha_entrega_estimada
      ) {
        throw new Error("Todos los campos requeridos deben estar llenos");
      }

      // Formatear la fecha correctamente
      const formatearFecha = (fechaString) => {
        if (fechaString.includes("/")) {
          // Convertir DD/MM/YYYY a YYYY-MM-DD
          const [dia, mes, año] = fechaString.split("/");
          return `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
        }
        return fechaString;
      };

      // Preparar los datos para enviar
      const datosFormateados = {
        direccion_entrega: solicitudData.direccion_entrega.trim(),
        material_solicitado: solicitudData.material_solicitado.trim(),
        cantidad_solicitada: parseFloat(solicitudData.cantidad_solicitada), // Convertir a número
        fecha_entrega_estimada: formatearFecha(
          solicitudData.fecha_entrega_estimada
        ),
        notas_cliente: solicitudData.notas_cliente
          ? solicitudData.notas_cliente.trim()
          : null,
        estado_solicitud: "Pendiente", // Valor por defecto del enum
      };

      console.log("Datos a enviar:", datosFormateados); // Para debugging

      const response = await fetch(`${API_BASE_URL}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosFormateados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error en createSolicitud:", error);
      throw error;
    }
  },

  // Obtener solicitudes del usuario
  getSolicitudes: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/solicitudes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const solicitudes = await response.json();
      return solicitudes;
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      throw error;
    }
  },

  // Actualizar solicitud (para operadores)
  updateSolicitud: async (solicitudId, vehicleId, routeId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/solicitudes/${solicitudId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_vehiculo: parseInt(vehicleId),
            id_ruta: parseInt(routeId),
            estado_solicitud: "Asignada",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      throw error;
    }
  },

  // Eliminar solicitud
  deleteSolicitud: async (solicitudId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/solicitudes/${solicitudId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      throw error;
    }
  },
};

export default solicitudService;
