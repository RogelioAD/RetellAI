import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../../constants/horizonTheme";

const YOUTUBE_VIDEO_ID = "OWFy-ZTI6vw"; // https://youtu.be/OWFy-ZTI6vw

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
          margin: "0 auto",
          maxWidth: isMobile ? "100%" : "800px",
          borderRadius: borderRadius.xl,
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
          aspectRatio: "16 / 9",
          backgroundColor: colors.gray[100],
        }}
      >
        {YOUTUBE_VIDEO_ID ? (
          <iframe
            title="Hear How It Sounds"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.text.secondary,
              fontSize: typography.fontSize.sm,
              padding: spacing.xl,
            }}
          >
            Video unavailable
          </div>
        )}
      </div>
    </div>
  );
}
