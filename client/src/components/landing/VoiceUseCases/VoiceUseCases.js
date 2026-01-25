import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../../constants/horizonTheme";

export default function VoiceUseCases() {
  const { isMobile } = useResponsive();

  const useCases = [
    {
      title: "Customer Service & Support",
      description: "Resolve common inquiries instantly. Route complex issues to specialists. Reduce hold times to zero while maintaining CSAT scores above 90%.",
      features: ["Order status and tracking", "Account inquiries and updates", "Technical troubleshooting", "Complaint resolution"]
    },
    {
      title: "Sales & Lead Qualification",
      description: "Qualify inbound leads 24/7 and book meetings directly into sales calendars. Outbound campaigns that reach thousands with personalized conversations.",
      features: ["Lead qualification and scoring", "Appointment scheduling", "Product information", "Follow-up campaigns"]
    },
    {
      title: "Appointment Management",
      description: "Automate scheduling, confirmations, and reminders. Reduce no-shows by 40% with proactive outreach and easy rescheduling options.",
      features: ["Booking and scheduling", "Confirmation calls", "Reminder campaigns", "Rescheduling requests"]
    },
    {
      title: "Collections & Payments",
      description: "Sensitive payment conversations handled with care. Compliant scripts, secure payment processing, and higher recovery rates than traditional methods.",
      features: ["Payment reminders", "Plan negotiations", "Secure payment capture", "Account resolution"]
    }
  ];

  return (
    <div
      id="voice-use-cases"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        marginTop: spacing['5xl'],
        padding: isMobile ? `0 ${spacing.xl}` : `0 ${spacing['4xl']}`,
        scrollMarginTop: isMobile ? "120px" : "140px",
      }}
    >
      {/* Header */}
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
          Voice AI Use Cases
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
          From customer service to sales, voice AI transforms how businesses communicate
        </p>
      </div>

      {/* Use Cases Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: spacing.xl,
        }}
      >
        {useCases.map((useCase, idx) => (
          <div
            key={idx}
            style={{
              ...plainCardStyles.base,
              borderRadius: borderRadius.xl,
              padding: spacing['3xl'],
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.md,
                fontFamily: typography.fontFamily.heading,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              {useCase.title}
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                lineHeight: 1.6,
                margin: 0,
                marginBottom: spacing.lg,
              }}
            >
              {useCase.description}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              {useCase.features.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: spacing.xs,
                  }}
                >
                  <span style={{ color: colors.brand[500], marginRight: spacing.xs }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
