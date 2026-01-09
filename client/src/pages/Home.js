import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import Button from "../components/common/Button";
import { spacing, typography } from "../constants/horizonTheme";
import "../index.css";

/**
 * Landing page component with brand logo and navigation to login.
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
        padding: isMobile ? `${spacing['3xl']} ${spacing.xl}` : spacing['5xl'],
        position: "relative",
      }}
    >
      {/* Fixed background image */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      
      {/* Overlay for better readability */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(244, 247, 254, 0.3)",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      <div style={{ textAlign: "center", marginBottom: spacing['4xl'], position: "relative", zIndex: 1 }}>
        <img
          src="/logo.png"
          alt="Quantum Consulting Logo"
          style={{
            width: isMobile ? "80px" : "120px",
            height: isMobile ? "80px" : "120px",
            objectFit: "contain",
            marginBottom: spacing['2xl'],
          }}
        />
        <h1
          className="brand-gradient-text"
          style={{
            fontSize: isMobile ? "3rem" : "4.5rem",
            fontWeight: typography.fontWeight.bold,
            margin: 0,
            textAlign: "center",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Quantum Consulting
        </h1>
      </div>
      
      <Button
        onClick={onNavigateToLogin}
        variant="primary"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        View Transcripts
      </Button>
    </div>
  );
}
