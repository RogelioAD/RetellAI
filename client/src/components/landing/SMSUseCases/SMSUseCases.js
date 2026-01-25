import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../../constants/horizonTheme";

export default function SMSUseCases() {
  const { isMobile } = useResponsive();

  const useCases = [
    {
      title: "Appointment Reminders",
      description: "Reduce no-shows by 40% with intelligent reminder sequences. Confirm, reschedule, or cancel with simple text responses.",
      features: ["Automated reminder sequences", "Easy rescheduling via text", "Calendar integration", "No-show follow-up"]
    },
    {
      title: "Order Updates & Tracking",
      description: "Keep customers informed at every step. Shipping notifications, delivery updates, and instant support for order inquiries.",
      features: ["Order confirmations", "Shipping notifications", "Delivery tracking", "Return processing"]
    },
    {
      title: "Sales & Promotions",
      description: "Drive revenue with targeted campaigns. Personalized offers, flash sales, and loyalty rewards delivered directly to customers.",
      features: ["Promotional campaigns", "Personalized offers", "Abandoned cart recovery", "Loyalty rewards"]
    },
    {
      title: "Customer Service",
      description: "Instant support via text. Answer FAQs, process requests, and escalate to agents when needed — all in the customer's preferred channel.",
      features: ["FAQ automation", "Account inquiries", "Issue resolution", "Agent escalation"]
    }
  ];

  return (
    <div
      id="sms-use-cases"
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
          SMS Use Cases
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
          From reminders to commerce, SMS AI transforms customer engagement
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
