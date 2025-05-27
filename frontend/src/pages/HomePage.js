// src/pages/HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../App.css'; // Asegúrate de que los estilos generales de la app, como los de la barra de navegación, estén accesibles.

function HomePage() {
  const navigate = useNavigate(); // Hook para la navegación programática

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title">SHOBOL S.A</div>
        <div className="navbar-actions">
          <button className="btn login" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
          <button className="btn register" onClick={() => navigate('/signup')}>
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content" data-aos="fade-up">
          <h1>Transporte Sostenible</h1>
          <p>
            Conectamos empresas con soluciones de transporte eficientes y
            sostenibles.
          </p>
          <button className="btn primary">Conoce Más</button>
        </div>
      </section>

      <section className="section" data-aos="fade-right">
        <h2>Nuestros Servicios</h2>
        <div className="card-container">
          <div className="card">Transporte eficiente</div>
          <div className="card">Rutas optimizadas</div>
          <div className="card">Compensación de carbono</div>
        </div>
      </section>

      <section className="section alt" data-aos="fade-left">
        <h2>Testimonios</h2>
        <div className="card-container">
          <div className="card">"Excelente servicio y compromiso."</div>
          <div className="card">"Sostenibilidad real en cada entrega."</div>
        </div>
      </section>

      <footer className="footer">
        © 2025 SHOBOL - Todos los derechos reservados
      </footer>
    </>
  );
}

export default HomePage;