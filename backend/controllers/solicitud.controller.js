// backend/controllers/solicitud.controller.js

const solicitudModel = require("../models/solicitud.model");
const vehicleModel = require("../models/vehicle.model");

const solicitudController = {
  // Obtener todas las solicitudes del cliente
  getSolicitudes: async (req, res, next) => {
    try {
      const solicitudes = await solicitudModel.findByUserId(req.user.id);
      res.json(solicitudes);
    } catch (error) {
      next(error);
    }
  },

  // Crear una nueva solicitud para un cliente
  createSolicitud: async (req, res, next) => {
    const {
      direccion_entrega,
      material_solicitado,
      cantidad_solicitada,
      fecha_entrega_estimada,
      notas_cliente,
    } = req.body;

    try {
      const newSolicitud = await solicitudModel.create({
        direccion_entrega,
        material_solicitado,
        cantidad_solicitada,
        fecha_entrega_estimada,
        notas_cliente,
        id_usuario: req.user.id, // El ID del usuario se obtiene desde el token
      });

      res.status(201).json({
        message: "Solicitud creada con éxito",
        solicitud: newSolicitud,
      });
    } catch (error) {
      next(error);
    }
  },

  // Asignar vehículo y ruta a una solicitud (para Admin y Operador de Rutas)
  assignVehicleAndRoute: async (req, res, next) => {
    const { solicitudId, vehicleId, routeId } = req.body;

    try {
      // Verificar que la solicitud exista
      const solicitud = await solicitudModel.findById(solicitudId);
      if (!solicitud) {
        return res.status(404).json({ message: "Solicitud no encontrada." });
      }

      // Verificar que el vehículo esté disponible
      const vehicle = await vehicleModel.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehículo no encontrado." });
      }

      // Actualizar la solicitud con el vehículo y la ruta
      const updatedSolicitud = await solicitudModel.update(solicitudId, {
        vehicle_id: vehicleId,
        route_id: routeId,
        estado_solicitud: "Asignado", // Cambiar el estado a "Asignado"
      });

      res.status(200).json({
        message: "Vehículo y ruta asignados con éxito.",
        solicitud: updatedSolicitud,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = solicitudController;
