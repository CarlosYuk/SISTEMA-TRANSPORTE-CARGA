// backend/controllers/vehicle.controller.js
const Vehicle = require("../models/vehicle.model");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const vehicleController = {
  getValidationErrors: (req) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return null;
    }
    const extractedErrors = [];
    errors.array().map((err) => {
      const field = err.path || err.param;
      extractedErrors.push({ field: field, message: err.msg });
    });
    return { errors: extractedErrors, message: "Errores de validación" };
  },

  getAllVehicles: async (req, res, next) => {
    try {
      const vehicles = await Vehicle.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (err) {
      console.error("Error al obtener todos los vehículos:", err);
      next(err);
    }
  },

  getVehicleById: async (req, res, next) => {
    try {
      const vehicle = await Vehicle.getVehicleById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehículo no encontrado." });
      }
      res.status(200).json(vehicle);
    } catch (err) {
      console.error("Error al obtener vehículo por ID:", err);
      next(err);
    }
  },

  createVehicle: async (req, res, next) => {
    const validationErrors = vehicleController.getValidationErrors(req);
    if (validationErrors) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error al eliminar archivo temporal:", err);
        });
      }
      return res.status(400).json(validationErrors);
    }

    const nombre_conductor = req.body.nombre_conductor || null;
    const imagen_url = req.file
      ? `uploads/vehicles/${req.file.filename}`
      : null;

    // Asegúrate de que las fechas sean NULL si están vacías
    const ultima_revision = req.body.ultima_revision
      ? new Date(req.body.ultima_revision)
      : null;
    const fecha_ultima_ubicacion = req.body.fecha_ultima_ubicacion
      ? new Date(req.body.fecha_ultima_ubicacion)
      : null;

    try {
      const newVehicleData = {
        ...req.body,
        capacidad_carga: parseFloat(req.body.capacidad_carga),
        anio: parseInt(req.body.anio, 10),
        estado_vehiculo: req.body.estado_vehiculo,
        tipo_combustible: req.body.tipo_combustible,
        nombre_conductor: nombre_conductor,
        imagen_url: imagen_url,
        ultima_revision: ultima_revision, // Usar el valor procesado
        fecha_ultima_ubicacion: fecha_ultima_ubicacion, // Usar el valor procesado
      };

      const newVehicle = await Vehicle.createVehicle(newVehicleData);
      res
        .status(201)
        .json({
          message: "Vehículo creado exitosamente.",
          vehicle: newVehicle,
        });
    } catch (err) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr)
            console.error(
              "Error al eliminar archivo temporal después de fallo de BD:",
              unlinkErr
            );
        });
      }
      console.error("Error al crear vehículo:", err);
      next(err);
    }
  },

  updateVehicle: async (req, res, next) => {
    const validationErrors = vehicleController.getValidationErrors(req);
    if (validationErrors) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error:", err);
        });
      }
      return res.status(400).json(validationErrors);
    }

    const { id } = req.params;

    const existingVehicle = await Vehicle.getVehicleById(id);
    if (!existingVehicle) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error:", err);
        });
      }
      return res
        .status(404)
        .json({ message: "Vehículo no encontrado para actualizar." });
    }

    const nombre_conductor = req.body.nombre_conductor || null;
    let imagen_url = existingVehicle.imagen_url;

    if (req.file) {
      imagen_url = `uploads/vehicles/${req.file.filename}`;
      if (
        existingVehicle.imagen_url &&
        existingVehicle.imagen_url !== imagen_url
      ) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          existingVehicle.imagen_url
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error al eliminar imagen antigua:", err);
        });
      }
    }

    // Asegúrate de que las fechas sean NULL si están vacías
    const ultima_revision = req.body.ultima_revision
      ? new Date(req.body.ultima_revision)
      : null;
    const fecha_ultima_ubicacion = req.body.fecha_ultima_ubicacion
      ? new Date(req.body.fecha_ultima_ubicacion)
      : null;

    try {
      const updatedVehicleData = {
        ...req.body,
        capacidad_carga: parseFloat(req.body.capacidad_carga),
        anio: parseInt(req.body.anio, 10),
        estado_vehiculo: req.body.estado_vehiculo,
        tipo_combustible: req.body.tipo_combustible,
        nombre_conductor: nombre_conductor,
        imagen_url: imagen_url,
        ultima_revision: ultima_revision, // Usar el valor procesado
        fecha_ultima_ubicacion: fecha_ultima_ubicacion, // Usar el valor procesado
      };

      const updatedVehicle = await Vehicle.updateVehicle(
        id,
        updatedVehicleData
      );
      res
        .status(200)
        .json({
          message: "Vehículo actualizado exitosamente.",
          vehicle: updatedVehicle,
        });
    } catch (err) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr)
            console.error(
              "Error al eliminar nuevo archivo subido después de fallo de BD:",
              unlinkErr
            );
        });
      }
      console.error("Error al actualizar vehículo:", err);
      next(err);
    }
  },

  deleteVehicle: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingVehicle = await Vehicle.getVehicleById(id);
      if (!existingVehicle) {
        return res.status(404).json({ message: "Vehículo no encontrado." });
      }

      const deletedVehicle = await Vehicle.deleteVehicle(id);

      if (deletedVehicle.imagen_url) {
        const imagePath = path.join(__dirname, "..", deletedVehicle.imagen_url);
        fs.unlink(imagePath, (err) => {
          if (err)
            console.error("Error al eliminar la imagen del vehículo:", err);
        });
      }

      res
        .status(200)
        .json({
          message: "Vehículo eliminado exitosamente.",
          vehicle: deletedVehicle,
        });
    } catch (err) {
      console.error("Error al eliminar vehículo:", err);
      next(err);
    }
  },

  // La función getAvailableDrivers debería haber sido comentada/eliminada
  // como se indicó en la respuesta anterior. Si sigue generando error,
  // asegúrate de que no haya ninguna ruta o llamada activa a esta función.
};

module.exports = vehicleController;
