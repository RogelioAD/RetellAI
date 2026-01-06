import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import "../index.css";

/**
 * Home/Landing page component with shiny gradient company name
 */
export default function Home({ onNavigateToLogin }) {
  const { isMobile } = useResponsive();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1b3a",
        padding: isMobile ? "32px 20px" : "48px",
      }}
    >
      <h1
        className="shiny-gradient-text"
        style={{
          fontSize: isMobile ? "3.5rem" : "5.5rem",
          fontWeight: 700,
          margin: 0,
          marginBottom: isMobile ? "3rem" : "4rem",
          textAlign: "center",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        Quantum Consulting
      </h1>
      <button
        onClick={onNavigateToLogin}
        style={{
          padding: isMobile ? "16px 32px" : "18px 40px",
          fontSize: isMobile ? "16px" : "18px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: "#d4d4d8",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: 400,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 50%, rgba(240, 147, 251, 0.2) 100%)";
          e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
          e.target.style.color = "#fff";
          e.target.style.fontWeight = 500;
          e.target.style.transform = "translateY(-1px) scale(1.02)";
          e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.35)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
          e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          e.target.style.color = "#d4d4d8";
          e.target.style.fontWeight = 400;
          e.target.style.transform = "translateY(0) scale(1)";
          e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
        }}
      >
        View Transcripts
      </button>
    </div>
  );
}

