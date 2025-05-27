// frontend/src/pages/SignUp.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
//import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "../SignUp.css";

const signupSchema = Yup.object().shape({
  username: Yup.string().trim().required("El nombre es obligatorio"),
  apellido: Yup.string().trim().required("El apellido es obligatorio"), // Añadido 'apellido'
  email: Yup.string().email("Email inválido").required("El correo electrónico es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria").min(6, "Debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Confirma tu contraseña'),
  telefono: Yup.string() // Añadido 'telefono' - puedes añadir validación de formato si lo necesitas
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos numéricos") // Ejemplo de validación para 10 dígitos
    .required("El teléfono es obligatorio"),
});

const SignUp = () => {
  const { signup, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      // El toast ya se muestra desde AuthContext, pero puedes añadir lógica aquí si quieres
      clearError(); // Limpia el error después de mostrarlo
    }
  }, [error, clearError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // El backend espera 'nombre', 'apellido', 'email', 'contrasena', 'telefono'
      await signup({
        username: values.username, // Mapea 'username' de Formik a 'nombre' del backend
        apellido: values.apellido,
        email: values.email,
        password: values.password, // Mapea 'password' de Formik a 'contrasena' del backend
        telefono: values.telefono,
        // No enviamos id_rol, el backend lo asigna por defecto (cliente)
      });
      // toast.success("¡Registro exitoso! Por favor, inicia sesión."); // Ya lo maneja AuthContext
      navigate("/login"); // Redirige al login después de un registro exitoso
    } catch (err) {
      // El error ya se maneja en AuthContext y con toast
      // console.error("Error de registro en componente:", err); // Puedes dejarlo para depuración
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-container">
        <div className="signup-header">
          <h2>Crear una cuenta</h2>
          <button className="close-btn" onClick={() => navigate('/')}>×</button>
        </div>

        <Formik
          initialValues={{ username: "", apellido: "", email: "", password: "", confirmPassword: "", telefono: "" }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form">
              <div className="form-group">
                <label htmlFor="username">Nombre</label>
                <Field id="username" name="username" type="text" className="input-field" placeholder="Tu nombre" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <Field id="apellido" name="apellido" type="text" className="input-field" placeholder="Tu apellido" />
                <ErrorMessage name="apellido" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <Field id="email" name="email" type="email" className="input-field" placeholder="ejemplo@dominio.com" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <Field id="password" name="password" type="password" className="input-field" placeholder="Mínimo 6 caracteres" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <Field id="confirmPassword" name="confirmPassword" type="password" className="input-field" placeholder="Repite tu contraseña" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <Field id="telefono" name="telefono" type="text" className="input-field" placeholder="Ej. 0987654321" />
                <ErrorMessage name="telefono" component="div" className="error-message" />
              </div>

              <button type="submit" disabled={isSubmitting} className="signup-btn">
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="signup-footer">
          ¿Ya tienes una cuenta?{" "}
          <span className="login-link" onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            Inicia sesión
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;