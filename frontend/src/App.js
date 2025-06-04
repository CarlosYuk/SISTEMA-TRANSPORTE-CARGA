// frontend/src/App.js
import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Páginas y componentes
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ClientDashboard from "./pages/ClientDashboard";


function PrivateRoute({ children, allowedRoleNames }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div>Cargando autenticación...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoleNames && !allowedRoleNames.includes(user.rol)) {
    toast.error("Acceso no autorizado a esta sección.");
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rutas privadas */}
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

          {/* Ruta para rutas no definidas */}
          <Route path="*" element={<div>404: Página no encontrada</div>} />
        </Routes>
      </Router>

      {/* Contenedor para notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;
