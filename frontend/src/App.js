// frontend/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext"; // <--- ¡Añade AuthContext aquí!
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importa los componentes de tus "páginas"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUp";

// Importa tus componentes de dashboard (asegúrate de que existen y están bien definidos)
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ClientDashboard from "./pages/ClientDashboard";

import "./App.css";

const PrivateRoute = ({ children, allowedRoleNames }) => {
  // Ahora AuthContext está disponible aquí
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoleNames && !allowedRoleNames.includes(user.rol)) {
    toast.error("Acceso no autorizado a esta sección.");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoleNames={["Administrador"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/operator"
              element={
                <PrivateRoute allowedRoleNames={["Operador de Tráfico"]}>
                  <OperatorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/client"
              element={
                <PrivateRoute allowedRoleNames={["Cliente"]}>
                  <ClientDashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<div>404: Página no encontrada</div>} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
