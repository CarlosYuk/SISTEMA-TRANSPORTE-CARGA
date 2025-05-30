// backend/app.js (o server.js)
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); // <--- ¡Importa las rutas de usuario!
const vehicleRoutes = require("./routes/vehicle.routes");
const roleRoutes = require("./routes/role.routes");
// Middlewares
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // <--- ¡Usa las rutas de usuario!
app.use("/api/vehicles", vehicleRoutes); // <--- Nueva
app.use("/api/roles", roleRoutes); // Asegurarse de que esté

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Ocurrió un error en el servidor",
    error: process.env.NODE_ENV === "development" ? err : {}, // En producción, no envíes detalles del error
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
