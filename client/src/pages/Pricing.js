import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import LandingHeader from "../components/layout/LandingHeader";
import PricingComponent from "../components/landing/Pricing";
import { colors, spacing, typography } from "../constants/horizonTheme";
import "../index.css";

export default function PricingPage() {
  const { isMobile } = useResponsive();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: colors.background.main,
      }}
    >
      {/* Header - fixed overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <LandingHeader />
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? "120px" : "140px",
          paddingBottom: spacing["5xl"],
          paddingLeft: isMobile ? spacing.xl : spacing["4xl"],
          paddingRight: isMobile ? spacing.xl : spacing["4xl"],
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Pricing Section */}
        <PricingComponent />
      </main>
    </div>
  );
}
