import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import Button from "../components/common/Button";
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
        background: "#0a0a0a",
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
      <Button
        onClick={onNavigateToLogin}
        style={{
          padding: isMobile ? "16px 32px" : "18px 40px",
          fontSize: isMobile ? "16px" : "18px",
          fontWeight: 500,
        }}
      >
        View Transcripts
      </Button>
    </div>
  );
}

