import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import Button from "../components/common/Button";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

/**
 * Home/Landing page with Horizon UI styling
 * Clean, modern landing page with brand gradient
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
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: isMobile ? `${spacing['3xl']} ${spacing.xl}` : spacing['5xl'],
        position: "relative",
      }}
    >
      {/* Overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(244, 247, 254, 0.55)",
        zIndex: 0,
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
            marginBottom: spacing.lg,
            textAlign: "center",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Quantum Consulting
        </h1>
        <p style={{
          fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
          color: colors.text.secondary,
          margin: "0 auto",
          maxWidth: "600px",
          textAlign: "center",
        }}>
          Access your call transcripts and analytics
        </p>
      </div>
      
      <Button
        onClick={onNavigateToLogin}
        variant="primary"
        style={{
          padding: isMobile ? `${spacing.lg} ${spacing['3xl']}` : `${spacing.xl} ${spacing['4xl']}`,
          fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
          position: "relative",
          zIndex: 1,
        }}
      >
        View Transcripts
      </Button>
    </div>
  );
}
