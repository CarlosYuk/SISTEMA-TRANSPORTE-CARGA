const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
//const vehicleRoutes = require("./routes/vehicle.routes");
//const routeRoutes = require("./routes/route.routes");
//const cargoRoutes = require("./routes/cargo.routes");
//const requestRoutes = require("./routes/request.routes");
//const incidentRoutes = require("./routes/incident.routes");
//const reportRoutes = require("./routes/report.routes");
//const notificationRoutes = require("./routes/notification.routes");
//const reviewRoutes = require("./routes/review.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//app.use("/api/vehicles", vehicleRoutes);
//app.use("/api/routes", routeRoutes);
//app.use("/api/cargo", cargoRoutes);
//app.use("/api/requests", requestRoutes);
//app.use("/api/incidents", incidentRoutes);
//app.use("/api/reports", reportRoutes);
//app.use("/api/notifications", notificationRoutes);
//app.use("/api/reviews", reviewRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "API del Sistema de Transporte de Carga Pesada" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
