import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../../constants/horizonTheme";

// https://youtu.be/oxYF-DTw1wU and https://youtu.be/oO6MjX6-Uec
const YOUTUBE_VIDEO_IDS = ["oxYF-DTw1wU", "oO6MjX6-Uec"];

export default function PageIntro() {
  const { isMobile } = useResponsive();

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: spacing["5xl"],
        position: "relative",
        zIndex: 1,
        width: "100%",
      }}
    >
      <div style={{ position: "relative", display: "inline-block", marginBottom: spacing["2xl"], textAlign: "center" }}>
        <h2
          style={{
            fontSize: isMobile ? typography.fontSize["3xl"] : typography.fontSize["5xl"],
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
          Hear How It Sounds
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: spacing.xl,
          margin: "0 auto",
          maxWidth: isMobile ? "100%" : "900px",
        }}
      >
        {YOUTUBE_VIDEO_IDS.map((videoId, index) => (
          <div
            key={videoId}
            style={{
              borderRadius: borderRadius.xl,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
              aspectRatio: "16 / 9",
              backgroundColor: colors.gray[100],
            }}
          >
            <iframe
              title={`Hear How It Sounds ${index + 1}`}
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
}
