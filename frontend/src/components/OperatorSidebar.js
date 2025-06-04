import React, { useState, useEffect, useCallback } from "react";

const OperatorSidebar = ({ setActiveSection, handleLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionChange = useCallback(
    (section) => {
      setActiveSection(section);
      setActiveItem(section);
      if (windowWidth <= 768) {
        setIsMobileMenuOpen(false);
      }
    },
    [setActiveSection, windowWidth]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (windowWidth <= 768 && isMobileMenuOpen) {
        const sidebar = document.querySelector(".operator-sidebar");
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
  }, [isMobileMenuOpen, windowWidth]);

  // Menú reducido para operador (sin administración)
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "users", label: "Gestión de Usuarios", icon: "👥" },
    { key: "vehicles", label: "Gestión de Vehículos", icon: "🚗" },
    { key: "routes", label: "Gestión de Rutas", icon: "🗺️" },
  ];

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {isMobileMenuOpen && windowWidth <= 768 && (
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

      <aside className={`operator-sidebar ${isMobileMenuOpen ? "active" : ""}`}>
        <h2>Panel del Operador</h2>

        {user && <p className="sidebar-welcome-text">Hola, {user.nombre}!</p>}

        <nav aria-label="Menú principal">
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

export default OperatorSidebar;
