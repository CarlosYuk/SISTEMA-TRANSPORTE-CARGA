import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../App.css";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-title">SHOBOL S.A</div>
        <div className="navbar-actions">
          <button
            className="btn login"
            onClick={() => navigate("/login")}
            aria-label="Ir a iniciar sesión"
          >
            Iniciar Sesión
          </button>
          <button
            className="btn register"
            onClick={() => navigate("/signup")}
            aria-label="Ir a registrarse"
          >
            Registrarse
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section" aria-label="Sección principal">
          <div className="hero-content" data-aos="fade-up">
            <h1>Transporte Sostenible</h1>
            <p>
              Conectamos empresas con soluciones de transporte eficientes y
              sostenibles.
            </p>
            <button
              className="btn primary"
              aria-label="Conocer más sobre transporte sostenible"
            >
              Conoce Más
            </button>
          </div>
        </section>

        <section
          className="section"
          data-aos="fade-right"
          aria-labelledby="servicios-title"
        >
          <h2 id="servicios-title">Nuestros Servicios</h2>
          <div className="card-container">
            <div className="card">Transporte eficiente</div>
            <div className="card">Rutas optimizadas</div>
            <div className="card">Compensación de carbono</div>
          </div>
        </section>

        <section
          className="section alt"
          data-aos="fade-left"
          aria-labelledby="testimonios-title"
        >
          <h2 id="testimonios-title">Testimonios</h2>
          <div className="card-container">
            <div className="card">"Excelente servicio y compromiso."</div>
            <div className="card">"Sostenibilidad real en cada entrega."</div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        © 2025 SHOBOL - Todos los derechos reservados
      </footer>
    </>
  );
}

export default HomePage;
