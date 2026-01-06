import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";

/**
 * Sticky header component for the application
 */
export default function AppHeader({ user, isAdmin, onLogout }) {
  const { isMobile } = useResponsive();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        padding: isMobile ? "16px 20px" : "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img
            src="/logo.png"
            alt="Quantum Consulting Logo"
            style={{
              width: isMobile ? "50px" : "58px",
              height: isMobile ? "50px" : "58px",
              objectFit: "contain",
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "1.25em" : "1.5em",
              fontWeight: 600,
              color: "#f4f4f5",
            }}
          >
            Quantum Consulting
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: isMobile ? 0 : "12px",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "0.9em" : "0.95em",
              color: "#f4f4f5",
              fontWeight: 500,
            }}
          >
            {user?.username || "User"}
          </span>
        </div>
        <Button 
          onClick={onLogout} 
          style={{ 
            fontSize: isMobile ? "13px" : "14px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
            color: "#ffffff"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 50%, rgba(240, 147, 251, 0.2) 100%)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
            e.target.style.color = "#ffffff";
            e.target.style.fontWeight = 500;
            e.target.style.transform = "translateY(-1px) scale(1.02)";
            e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.color = "#ffffff";
            e.target.style.fontWeight = 400;
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

