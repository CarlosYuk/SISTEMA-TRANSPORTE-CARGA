const clientController = {
  // Obtener el perfil del cliente
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await pool.query(
        "SELECT nombre, apellido, email, telefono, estado FROM public.usuario WHERE id_usuario = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  // Obtener las solicitudes del cliente
  getSolicitudesByCliente: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await pool.query(
        "SELECT * FROM public.solicitud_cliente WHERE id_usuario = $1 ORDER BY fecha_solicitud DESC",
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = clientController;
