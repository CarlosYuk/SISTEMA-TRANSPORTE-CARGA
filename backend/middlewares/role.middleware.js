module.exports = (rolesAllowed) => {
  return (req, res, next) => {
    const { nombre_rol } = req.user;

    if (!rolesAllowed.includes(nombre_rol)) {
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};
