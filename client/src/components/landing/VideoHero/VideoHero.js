import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography } from "../../../constants/horizonTheme";
import "../../../index.css";

export default function VideoHero() {
  const { isMobile } = useResponsive();

  // Reserve space for sticky navbar so hero text isn't covered
  // Desktop navbar: ~72px height + 20px padding = ~112px, using 140px for safety
  // Mobile navbar: ~64px height + 16px padding = ~96px, using 160px for safety
  const navbarReserve = isMobile ? 160 : 140;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: isMobile ? "85vh" : "70vh",
        minHeight: isMobile ? "580px" : "500px",
        position: "relative",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/colorfulVid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Text Readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 1,
        }}
      />

      {/* Hero Text Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1000px",
          bottom: 0,
          zIndex: 2,
          paddingTop: navbarReserve,
          paddingBottom: isMobile ? spacing['2xl'] : spacing['3xl'],
          paddingLeft: isMobile ? spacing['3xl'] : spacing['4xl'],
          paddingRight: isMobile ? spacing['3xl'] : spacing['4xl'],
          boxSizing: "border-box",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          overflowY: isMobile ? "auto" : "visible",
        }}
      >
        <p
          style={{
            fontSize: isMobile ? typography.fontSize.xl : typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.white,
            margin: 0,
            lineHeight: 1.3,
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
            letterSpacing: "-0.01em",
          }}
        >
          You're paying $35,000 a year for someone who takes lunch breaks, sick days, and can only answer one call at a time.
        </p>
        <p
          style={{
            fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
            fontWeight: typography.fontWeight.medium,
            color: "rgba(255, 255, 255, 0.95)",
            margin: 0,
            marginTop: spacing.lg,
            lineHeight: 1.6,
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Missed calls cost businesses $25,000+ a month. Our AI receptionist works 24/7 for a fraction of the cost.
        </p>

        {/* Key Points */}
        <div
          className="hero-keypoints"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? spacing.xl : spacing['2xl'],
            width: "100%",
            marginTop: isMobile ? spacing['3xl'] : spacing['4xl'],
            paddingTop: isMobile ? spacing['2xl'] : spacing['3xl'],
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: spacing.sm, minWidth: isMobile ? undefined : "180px" }}>
            <span className="hero-keypoint-num">1</span>
            <span style={{ fontWeight: 600, fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg, color: colors.text.white, textShadow: "0 1px 8px rgba(0, 0, 0, 0.25)", textWrap: "balance" }}>
              Never Miss A Customer Ready To{"\u00A0"}Pay
            </span>
            <span style={{ fontSize: typography.fontSize.sm, color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.5, textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)" }}>
              6 out of 10 phone calls to small businesses go unanswered.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: spacing.sm, minWidth: isMobile ? undefined : "180px" }}>
            <span className="hero-keypoint-num">2</span>
            <span style={{ fontWeight: 600, fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg, color: colors.text.white, textShadow: "0 1px 8px rgba(0, 0, 0, 0.25)", textWrap: "balance" }}>
              The First Business To Answer Gets The{"\u00A0"}Job
            </span>
            <span style={{ fontSize: typography.fontSize.sm, color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.5, textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)" }}>
              85% of callers don't call back after their first attempt.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: spacing.sm, minWidth: isMobile ? undefined : "180px" }}>
            <span className="hero-keypoint-num">3</span>
            <span style={{ fontWeight: 600, fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg, color: colors.text.white, textShadow: "0 1px 8px rgba(0, 0, 0, 0.25)", textWrap: "balance" }}>
              Never Put A Customer On{"\u00A0"}Hold
            </span>
            <span style={{ fontSize: typography.fontSize.sm, color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.5, textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)" }}>
              33% of consumers won't wait on hold for customer service.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
