// frontend/src/components/Sidebar.js
import React, { useState, useEffect } from "react";

const Sidebar = ({ setActiveSection, handleLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Cerrar el menú móvil cuando se cambia el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para manejar el cambio de sección
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setActiveItem(section);
    // Cerrar el menú móvil después de seleccionar una opción
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  // Función para toggle del menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar menú al hacer clic fuera (solo en móviles)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && isMobileMenuOpen) {
        const sidebar = document.querySelector(".admin-sidebar");
        const menuBtn = document.querySelector(".mobile-menu-btn");

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          menuBtn &&
          !menuBtn.contains(event.target)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "users", label: "Gestión de Usuarios", icon: "👥" },
    { key: "vehicles", label: "Gestión de Vehículos", icon: "🚗" },
    { key: "routes", label: "Gestión de Rutas", icon: "🗺️" },
    { key: "requests", label: "Solicitudes de Clientes", icon: "📋" },
    { key: "incidents", label: "Incidencias", icon: "⚠️" },
    { key: "reports", label: "Reportes", icon: "📊" },
    { key: "reviews", label: "Reseñas", icon: "⭐" },
  ];

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Overlay para móviles */}
      {isMobileMenuOpen && window.innerWidth <= 768 && (
        <div
          className="mobile-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? "active" : ""}`}>
        <h2>Panel de Administrador</h2>

        {user && <p className="sidebar-welcome-text">Hola, {user.nombre}!</p>}

        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleSectionChange(item.key)}
                  className={activeItem === item.key ? "active" : ""}
                  style={{
                    background:
                      activeItem === item.key
                        ? "rgba(255, 255, 255, 0.15)"
                        : "none",
                    borderLeft:
                      activeItem === item.key ? "4px solid #3498db" : "none",
                  }}
                >
                  <span className="menu-icon" style={{ marginRight: "10px" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <span style={{ marginRight: "8px" }}>🚪</span>
          Cerrar Sesión
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
