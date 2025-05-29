// backend/app.js (o server.js)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); // <--- ¡Importa las rutas de usuario!

// Middlewares
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones JSON

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // <--- ¡Usa las rutas de usuario!

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
