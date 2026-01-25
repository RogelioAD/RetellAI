import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Icon from "./Icon";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../constants/horizonTheme";

export default function FeatureCards() {
  const { isMobile } = useResponsive();

  const features = [
    {
      title: "Smart SMS Follow-up",
      description: "If a caller hangs up or needs a link, the AI instantly sends a text message with your booking link or info.",
      icon: "message",
      iconColor: "#3B82F6", // Blue
    },
    {
      title: "Spam Blocker",
      description: "Robocalls don't get through. The AI screens every call so your phone only rings for real customers.",
      icon: "shield",
      iconColor: "#8B5CF6", // Purple
    },
    {
      title: "Multilingual",
      description: "Speak to your entire community. The AI fluently switches between English, Spanish, French, and 20+ others.",
      icon: "globe",
      iconColor: "#EC4899", // Pink
    },
    {
      title: "Live Transfer",
      description: "High-value lead on the line? The AI can patch the call directly to your personal cell phone instantly.",
      icon: "phoneTransfer",
      iconColor: "#3B82F6", // Blue
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? `${spacing['4xl']} ${spacing.xl}` : `${spacing['5xl']} ${spacing['4xl']}`,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: spacing['4xl'],
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.lg,
            fontFamily: typography.fontFamily.display,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Does More Than Talk
        </h2>
        <p
          style={{
            fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
            color: colors.text.secondary,
            margin: 0,
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Your AI handles the entire customer journey from call to close.
        </p>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: spacing.xl,
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              ...plainCardStyles.base,
              borderRadius: borderRadius.xl,
              padding: spacing['3xl'],
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(66, 42, 251, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: spacing.lg,
              }}
            >
              <div
                style={{
                  width: isMobile ? "56px" : "64px",
                  height: isMobile ? "56px" : "64px",
                  borderRadius: borderRadius.lg,
                  backgroundColor: `${feature.iconColor}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={feature.icon}
                  size={isMobile ? 28 : 32}
                  color={feature.iconColor}
                  strokeWidth="2"
                />
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: isMobile ? typography.fontSize.xl : typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.md,
                fontFamily: typography.fontFamily.heading,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
