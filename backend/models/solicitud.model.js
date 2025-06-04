const pool = require("../config/db.config"); // Asegúrate de que el pool esté bien configurado

// Modelo para la tabla solicitud_cliente
const solicitudModel = {
  // Función para obtener las solicitudes por ID de usuario
  findByUserId: async (userId) => {
    try {
      const result = await pool.query(
        "SELECT * FROM solicitud_cliente WHERE id_usuario = $1",
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error("Error al obtener las solicitudes del cliente");
    }
  },

  // Función para encontrar solicitud por ID
  findById: async (solicitudId) => {
    try {
      const result = await pool.query(
        "SELECT * FROM solicitud_cliente WHERE id_solicitud = $1",
        [solicitudId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error al obtener la solicitud");
    }
  },

  // Función para actualizar una solicitud (asignar vehículo y ruta)
  updateSolicitud: async (solicitudId, vehicleId, routeId) => {
    try {
      const result = await pool.query(
        "UPDATE solicitud_cliente SET vehicle_id = $1, route_id = $2, estado_solicitud = 'Asignado' WHERE id_solicitud = $3 RETURNING *",
        [vehicleId, routeId, solicitudId]
      );
      return result.rows[0]; // Devuelve la solicitud actualizada
    } catch (error) {
      throw new Error("Error al actualizar la solicitud");
    }
  },

  // Función para crear una nueva solicitud
  create: async (data) => {
    try {
      const result = await pool.query(
        "INSERT INTO solicitud_cliente (direccion_entrega, material_solicitado, cantidad_solicitada, fecha_entrega_estimada, notas_cliente, id_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          data.direccion_entrega,
          data.material_solicitado,
          data.cantidad_solicitada,
          data.fecha_entrega_estimada,
          data.notas_cliente,
          data.id_usuario,
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error al crear la solicitud");
    }
  },
};

module.exports = solicitudModel;
