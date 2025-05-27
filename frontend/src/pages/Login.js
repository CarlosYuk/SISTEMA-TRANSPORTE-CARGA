// frontend/src/pages/Login.js
import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "../Login.css";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
});

const Login = () => {
  const { login, error, clearError, user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const redirectToDashboard = useCallback(
    (roleName) => {
      switch (roleName) {
        case "Administrador": // ¡Debe ser "Administrador" (con A mayúscula)!
          navigate("/admin");
          break;
        case "Operador de Tráfico": // ¡Debe ser "Operador de Tráfico" (con O y T mayúscula y espacio)!
          navigate("/operator");
          break;
        case "Cliente": // ¡Debe ser "Cliente" (con C mayúscula)!
          navigate("/client");
          break;
        default:
          // Si el rol no coincide con ninguna ruta, redirige a la página principal.
          // Esto podría ser la causa del 404 si el rol no coincide.
          navigate("/");
          break;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (error) {
      clearError();
    }
    // Si el usuario ya está logueado y tiene un rol, redirige
    if (user && user.rol) {
      redirectToDashboard(user.rol);
    }
  }, [error, clearError, user, redirectToDashboard]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const loggedInUser = await login(values);
      if (loggedInUser && loggedInUser.rol) {
        redirectToDashboard(loggedInUser.rol);
      } else {
        // Esto debería activarse si el backend no devuelve un rol, lo cual no debería pasar
        toast.error(
          "No se pudo determinar el rol del usuario. Redirigiendo a la página principal."
        );
        navigate("/");
      }
    } catch (err) {
      // Los errores ya los maneja AuthContext con toasts
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2>Iniciar sesión</h2>
          <button className="close-btn" onClick={() => navigate("/")}>
            ×
          </button>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="Correo electrónico"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group relative">
                <label htmlFor="password">Contraseña</label>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="show-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="login-btn"
              >
                {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          ¿No tienes una cuenta?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/signup")}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Regístrate
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
