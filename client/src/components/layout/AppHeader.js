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
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: isMobile ? "16px 20px" : "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
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
        <Button onClick={onLogout} style={{ fontSize: isMobile ? "13px" : "14px" }}>
          Logout
        </Button>
      </div>
    </header>
  );
}

