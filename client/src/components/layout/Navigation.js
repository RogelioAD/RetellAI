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
        {sections.map((section) => (
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
              color: currentSection === section.id ? "#ffffff" : "#71717a",
              fontSize: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "20px" }}>{section.icon}</span>
            <span style={{ fontWeight: currentSection === section.id ? 500 : 400 }}>
              {section.label}
            </span>
            {currentSection === section.id && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "0 0 2px 2px",
                }}
              />
            )}
          </button>
        ))}
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

