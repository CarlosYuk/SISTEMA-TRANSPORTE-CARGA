// src/index.js (o main.jsx)
import React from "react";
import ReactDOM from "react-dom/client"; // Para React 18+
import "./index.css"; // Si tienes un CSS global
import App from "./App"; // Asegúrate de que esta ruta sea correcta

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
