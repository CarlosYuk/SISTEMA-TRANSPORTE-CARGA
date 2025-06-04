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
        case "Administrador":
          navigate("/admin");
          break;
        case "Operador de Tráfico":
          navigate("/operator");
          break;
        case "Cliente":
          navigate("/client");
          break;
        default:
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
    if (user?.rol) {
      redirectToDashboard(user.rol);
    }
  }, [error, clearError, user, redirectToDashboard]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const loggedInUser = await login(values);
      if (loggedInUser?.rol) {
        redirectToDashboard(loggedInUser.rol);
      } else {
        toast.error(
          "No se pudo determinar el rol del usuario. Redirigiendo a la página principal."
        );
        navigate("/");
      }
    } catch {
      // Error ya manejado en AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div
        className="login-container"
        role="main"
        aria-labelledby="login-header"
      >
        <div className="login-header" id="login-header">
          <h2>Iniciar sesión</h2>
          <button
            className="close-btn"
            onClick={() => navigate("/")}
            aria-label="Cerrar ventana de inicio de sesión"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="Correo electrónico"
                  autoComplete="email"
                  aria-required="true"
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
                  autoComplete="current-password"
                  aria-required="true"
                />
                <button
                  type="button"
                  className="show-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
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
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/signup")}
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
