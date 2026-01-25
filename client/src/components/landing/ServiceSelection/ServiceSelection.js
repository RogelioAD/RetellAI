import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import Icon from "../../common/Icon";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../../constants/horizonTheme";

export default function ServiceSelection() {
  const { isMobile } = useResponsive();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isMobile ? 120 : 140; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: spacing.xl,
        width: "100%",
        maxWidth: "800px",
      }}
    >
      {/* Voice Card */}
      <div
        onClick={() => scrollToSection("voice-use-cases")}
        style={{
          ...plainCardStyles.base,
          borderRadius: borderRadius.xl,
          padding: spacing['3xl'],
          cursor: "pointer",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(66, 42, 251, 0.15)";
          e.currentTarget.style.borderColor = colors.brand[200];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: spacing.lg,
          color: colors.brand[500],
        }}>
          <Icon name="phone" size={48} color={colors.brand[500]} strokeWidth="2" />
        </div>
        <h3
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Voice
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Intelligent voice AI that handles customer calls with natural, human-like conversations
        </p>
      </div>

      {/* SMS Card */}
      <div
        onClick={() => scrollToSection("sms-use-cases")}
        style={{
          ...plainCardStyles.base,
          borderRadius: borderRadius.xl,
          padding: spacing['3xl'],
          cursor: "pointer",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(66, 42, 251, 0.15)";
          e.currentTarget.style.borderColor = colors.brand[200];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: spacing.lg,
          color: colors.brand[500],
        }}>
          <Icon name="message" size={48} color={colors.brand[500]} strokeWidth="2" />
        </div>
        <h3
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.md,
            fontFamily: typography.fontFamily.display,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          SMS
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Smart SMS AI that delivers instant, context-aware responses to keep customers engaged
        </p>
      </div>
    </div>
  );
}
