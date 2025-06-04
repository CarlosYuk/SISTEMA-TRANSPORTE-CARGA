// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // React 18+
import "./index.css"; // CSS global, si existe
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
