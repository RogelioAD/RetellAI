import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, borderRadius } from "../../constants/horizonTheme";

// Google Forms wrapper component
// Uses the Google Forms embed URL format
export default function GoogleFormWrapper() {
  const { isMobile } = useResponsive();

  // Google Forms embed URL
  // Short link: https://forms.gle/dMup1727PENArpjP7
  // Note: To get the proper embed URL, go to your Google Form > Send > Embed HTML
  // For now, using the short URL - if it doesn't work, use the embed code from Google Forms
  const formUrl = "https://forms.gle/dMup1727PENArpjP7";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <iframe
        src={formUrl}
        width="100%"
        height={isMobile ? "1200" : "1000"}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        style={{
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.gray[200]}`,
          overflow: "hidden",
          backgroundColor: colors.background.card,
        }}
        title="AI Receptionist Contact Form"
      >
        Loading…
      </iframe>
    </div>
  );
}
