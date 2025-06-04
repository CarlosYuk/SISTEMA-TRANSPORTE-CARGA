import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";
import "../SignUp.css";

const signupSchema = Yup.object().shape({
  username: Yup.string().trim().required("El nombre es obligatorio"),
  apellido: Yup.string().trim().required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Email inválido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos numéricos")
    .required("El teléfono es obligatorio"),
});

const SignUp = () => {
  const { signup, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await signup({
        username: values.username,
        apellido: values.apellido,
        email: values.email,
        password: values.password,
        telefono: values.telefono,
      });
      navigate("/login");
    } catch {
      // Error gestionado en AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div
        className="signup-container"
        role="main"
        aria-labelledby="signup-header"
      >
        <div className="signup-header" id="signup-header">
          <h2>Crear una cuenta</h2>
          <button
            className="close-btn"
            onClick={() => navigate("/")}
            aria-label="Cerrar ventana de registro"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={{
            username: "",
            apellido: "",
            email: "",
            password: "",
            confirmPassword: "",
            telefono: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form" noValidate>
              <div className="form-group">
                <label htmlFor="username">Nombre</label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className="input-field"
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  aria-required="true"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <Field
                  id="apellido"
                  name="apellido"
                  type="text"
                  className="input-field"
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  aria-required="true"
                />
                <ErrorMessage
                  name="apellido"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="ejemplo@dominio.com"
                  autoComplete="email"
                  aria-required="true"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  aria-required="true"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input-field"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  aria-required="true"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <Field
                  id="telefono"
                  name="telefono"
                  type="text"
                  className="input-field"
                  placeholder="Ej. 0987654321"
                  autoComplete="tel"
                  aria-required="true"
                />
                <ErrorMessage
                  name="telefono"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="signup-btn"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="signup-footer">
          ¿Ya tienes una cuenta?{" "}
          <span
            className="login-link"
            onClick={() => navigate("/login")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/login")}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Inicia sesión
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
