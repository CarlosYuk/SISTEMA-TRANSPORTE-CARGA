const pool = require("../config/db.config");

const Vehicle = {
  getAllVehicles: async () => {
    const query = `
      SELECT
          v.id_vehiculo,
          v.placa,
          v.marca,
          v.modelo,
          v.anio,
          v.capacidad_carga,
          v.tipo_combustible,    -- <--- Usar tipo_combustible
          v.estado_vehiculo,     -- <--- Usar estado_vehiculo
          v.fecha_registro,
          v.ultima_ubicacion,
          v.fecha_ultima_ubicacion,
          v.consumo_combustible,
          v.imagen_url,
          v.nombre_conductor,
          v.ultima_revision      -- <--- Usar ultima_revision
      FROM
          vehiculo v
      ORDER BY
          v.id_vehiculo ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  getVehicleById: async (id) => {
    const query = `
      SELECT
          v.id_vehiculo,
          v.placa,
          v.marca,
          v.modelo,
          v.anio,
          v.capacidad_carga,
          v.tipo_combustible,
          v.estado_vehiculo,
          v.fecha_registro,
          v.ultima_ubicacion,
          v.fecha_ultima_ubicacion,
          v.consumo_combustible,
          v.imagen_url,
          v.nombre_conductor,
          v.ultima_revision
      FROM
          vehiculo v
      WHERE
          v.id_vehiculo = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  createVehicle: async (vehicleData) => {
    const {
      placa,
      marca,
      modelo,
      anio,
      capacidad_carga,
      tipo_combustible, // <--- Usar tipo_combustible
      estado_vehiculo, // <--- Usar estado_vehiculo
      nombre_conductor,
      imagen_url,
      ultima_ubicacion,
      fecha_ultima_ubicacion,
      consumo_combustible,
      ultima_revision, // <--- Añadir ultima_revision
    } = vehicleData;

    const result = await pool.query(
      `INSERT INTO vehiculo (placa, marca, modelo, anio, capacidad_carga, tipo_combustible, estado_vehiculo, nombre_conductor, imagen_url, ultima_ubicacion, fecha_ultima_ubicacion, consumo_combustible, ultima_revision)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        placa,
        marca,
        modelo,
        anio,
        capacidad_carga,
        tipo_combustible,
        estado_vehiculo,
        nombre_conductor,
        imagen_url,
        ultima_ubicacion,
        fecha_ultima_ubicacion,
        consumo_combustible,
        ultima_revision,
      ]
    );
    return result.rows[0];
  },

  updateVehicle: async (id, vehicleData) => {
    const {
      placa,
      marca,
      modelo,
      anio,
      capacidad_carga,
      tipo_combustible, // <--- Usar tipo_combustible
      estado_vehiculo, // <--- Usar estado_vehiculo
      nombre_conductor,
      imagen_url,
      ultima_ubicacion,
      fecha_ultima_ubicacion,
      consumo_combustible,
      ultima_revision, // <--- Añadir ultima_revision
    } = vehicleData;

    const result = await pool.query(
      `UPDATE vehiculo
       SET
          placa = $1,
          marca = $2,
          modelo = $3,
          anio = $4,
          capacidad_carga = $5,
          tipo_combustible = $6,
          estado_vehiculo = $7,
          nombre_conductor = $8,
          imagen_url = $9,
          ultima_ubicacion = $10,
          fecha_ultima_ubicacion = $11,
          consumo_combustible = $12,
          ultima_revision = $13
       WHERE id_vehiculo = $14
       RETURNING *`,
      [
        placa,
        marca,
        modelo,
        anio,
        capacidad_carga,
        tipo_combustible,
        estado_vehiculo,
        nombre_conductor,
        imagen_url,
        ultima_ubicacion,
        fecha_ultima_ubicacion,
        consumo_combustible,
        ultima_revision,
        id,
      ]
    );
    return result.rows[0];
  },

  deleteVehicle: async (id) => {
    const result = await pool.query(
      `DELETE FROM vehiculo WHERE id_vehiculo = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // ELIMINAR O COMENTAR la función getAvailableDrivers si no existe en tu modelo.
  // Si la necesitas, deberías crear un modelo 'driver.model.js' y un controlador 'driver.controller.js'
  // y luego importarlo donde sea necesario (por ejemplo, en un endpoint separado para conductores).
  // NO LA PONGAS EN vehicle.model.js a menos que sea específicamente para vehículos.
};

module.exports = Vehicle;
