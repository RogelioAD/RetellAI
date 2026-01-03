import React from "react";
import { useResponsive } from "../../hooks/useResponsive";

/**
 * Navigation component - Sidebar on desktop, bottom nav on mobile
 */
export default function Navigation({ currentSection, onSectionChange, isAdmin }) {
  const { isMobile } = useResponsive();

  const sections = [
    { id: "calls", label: "Calls", icon: "📞" },
    ...(isAdmin ? [{ id: "users", label: "Users", icon: "👥" }] : []),
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  if (isMobile) {
    // Bottom navigation for mobile
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "8px 0",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        {sections.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: isActive ? "#ffffff" : "#71717a",
                fontSize: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                    zIndex: -1,
                    transition: "all 0.3s ease",
                  }}
                />
              )}
              <span style={{ fontSize: "20px", position: "relative", zIndex: 1 }}>
                {section.icon}
              </span>
              <span
                style={{
                  fontWeight: isActive ? 500 : 400,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Sidebar navigation for desktop
  return (
    <aside
      style={{
        width: "200px",
        minWidth: "200px",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          style={{
            width: "100%",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background:
              currentSection === section.id
                ? "rgba(102, 126, 234, 0.15)"
                : "transparent",
            border: "none",
            borderLeft:
              currentSection === section.id
                ? "3px solid #667eea"
                : "3px solid transparent",
            color: currentSection === section.id ? "#ffffff" : "#a1a1aa",
            fontSize: "14px",
            fontWeight: currentSection === section.id ? 500 : 400,
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (currentSection !== section.id) {
              e.target.style.background = "rgba(255, 255, 255, 0.05)";
              e.target.style.color = "#d4d4d8";
            }
          }}
          onMouseLeave={(e) => {
            if (currentSection !== section.id) {
              e.target.style.background = "transparent";
              e.target.style.color = "#a1a1aa";
            }
          }}
        >
          <span style={{ fontSize: "18px" }}>{section.icon}</span>
          <span>{section.label}</span>
        </button>
      ))}
    </aside>
  );
}

