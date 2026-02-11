import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Icon from "./Icon";
import { CIcon } from "@coreui/icons-react";
import { cilInfinity } from "@coreui/icons";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../constants/horizonTheme";

export default function FeatureCards() {
  const { isMobile } = useResponsive();

  const features = [
    {
      title: "Multilingual",
      description: "Speak to your entire community. The AI fluently switches between English, Spanish, Portuguese, French, and 30+ others.",
      icon: "globe",
      iconColor: "#EC4899", // Pink
    },
    {
      title: "Unlimited Capacity",
      description: "The AI can handle an unlimited amount of simultaneous calls unlike a human receptionist.",
      icon: "infinity",
      iconColor: "#10B981", // Green
    },
    {
      title: "Live Transfer",
      description: "High-value lead on the line? The AI can transfer the call directly to your personal cell phone instantly.",
      icon: "phoneTransfer",
      iconColor: "#3B82F6", // Blue
    },
    {
      title: "Spam Blocker",
      description: "Robocalls don't get through. The AI screens every call so your phone only rings for real customers.",
      icon: "shield",
      iconColor: "#8B5CF6", // Purple
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
      {/* Header Section – same styling as Patient Journey header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: spacing['4xl'],
        }}
      >
        <div style={{ position: "relative", display: "inline-block", marginBottom: spacing['2xl'], textAlign: "center" }}>
          <h2
            style={{
              fontSize: isMobile ? typography.fontSize['3xl'] : typography.fontSize['5xl'],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              margin: 0,
              paddingBottom: 20,
              fontFamily: typography.fontFamily.display,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              lineHeight: 1.15,
              transform: "scaleY(1.08)",
              transformOrigin: "center",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            Your Front Desk On Autopilot
          </h2>
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${colors.brand[500]}, transparent)`,
            }}
          />
        </div>
        <p
          style={{
            fontSize: isMobile ? typography.fontSize.lg : typography.fontSize['2xl'],
            color: colors.text.secondary,
            margin: 0,
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: isMobile ? 0 : "10%",
            paddingRight: isMobile ? 0 : "10%",
            lineHeight: 1.6,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: "0.02em",
          }}
        >
          No more language barriers, spam calls, or customers lost while you're tied up on another call
        </p>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
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
                {feature.icon === "infinity" ? (
                  <CIcon icon={cilInfinity} width={isMobile ? 28 : 32} height={isMobile ? 28 : 32} style={{ color: feature.iconColor }} />
                ) : (
                  <Icon
                    name={feature.icon}
                    size={isMobile ? 28 : 32}
                    color={feature.iconColor}
                    strokeWidth="2"
                  />
                )}
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
