import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import LandingHeader from "../../layout/LandingHeader";
import Button from "../../common/Button";
import VideoHero from "../VideoHero";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../../constants/horizonTheme";

export default function ServiceDetail({ section, onBack }) {
  const { isMobile } = useResponsive();

  const sectionData = {
    voice: {
      title: "Voice AI Solutions",
      description: "Experience intelligent voice interactions powered by advanced AI. Our voice solutions provide seamless, natural conversations that enhance customer experience and streamline operations.",
      stats: [
        { value: "100%", label: "Calls Answered" },
        { value: "24/7", label: "Availability" }
      ]
    },
    sms: {
      title: "SMS AI Solutions",
      description: "Engage customers through intelligent SMS conversations. Our SMS AI platform delivers instant, context-aware responses that keep your customers informed and satisfied.",
      stats: [
        { value: "Instant", label: "Response Time" },
        { value: "Smart", label: "Context Awareness" }
      ]
    }
  };

  const data = sectionData[section];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: colors.background.card,
      }}
    >
      {/* Video Hero Section */}
      <VideoHero />

      {/* Header - fixed overlay on top of the video */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <LandingHeader />
      </div>

      {/* Section Content with white background */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile 
            ? `${spacing['4xl']} ${spacing.xl} ${spacing['5xl']}` 
            : `${spacing['5xl']} ${spacing['4xl']}`,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: colors.background.card,
        }}
      >
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          style={{
            alignSelf: "flex-start",
            marginBottom: spacing.xl,
          }}
        >
          ← Back
        </Button>

        {/* Section Content */}
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            ...plainCardStyles.base,
            borderRadius: borderRadius.xl,
            padding: isMobile ? spacing['3xl'] : spacing['4xl'],
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.xl,
              textAlign: "center",
            }}
          >
            {data.title}
          </h2>
          <p
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              lineHeight: 1.8,
              textAlign: "center",
              marginBottom: spacing['2xl'],
            }}
          >
            {data.description}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: spacing.xl,
              marginTop: spacing['3xl'],
            }}
          >
            {data.stats.map((stat, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: typography.fontSize['3xl'], 
                  fontWeight: typography.fontWeight.bold, 
                  color: colors.brand[500], 
                  marginBottom: spacing.sm 
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: colors.text.secondary 
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
