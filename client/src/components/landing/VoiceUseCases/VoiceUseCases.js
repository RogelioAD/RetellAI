import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import Icon from "../../common/Icon";
import { colors, spacing, typography, plainCardStyles, borderRadius } from "../../../constants/horizonTheme";

export default function VoiceUseCases() {
  const { isMobile } = useResponsive();

  const inboundFeatures = [
    "Answer calls instantly, 24/7",
    "Book, reschedule, and cancel appointments",
    "Answer FAQs and provide job quotes",
    "Route urgent calls to the right person",
    "24/7 emergency dispatch coordination",
    "Order status updates"
  ];

  const outboundFeatures = [
    "Appointment confirmations and reminders",
    "Payment collection and invoice reminders",
    "Form submission follow-up",
    "Past customer reactivation",
    "Lead re-engagement campaigns",
    "Canceled appointment rescheduling"
  ];

  const useCases = [
    {
      title: "Medical Offices, Dentistry & Med Spas",
      problem: "Your receptionist is helping a patient at the front desk. The phone rings. The caller waits on hold, gets frustrated, and hangs up.",
      solution: "The AI answers every call instantly—no hold music, no missed patients.",
      features: [
        "Appointment scheduling, rescheduling, and cancellations",
        "Insurance verification",
        "Prescription refill requests",
        "Outbound appointment reminder calls"
      ],
      icon: "hospital",
      iconColor: "#10B981" // Green for medical
    },
    {
      title: "Barbershops, Salons & Small Shops",
      problem: "You're mid-haircut, scissors in hand. The phone rings and it goes to voicemail. That caller just booked with the shop down the street.",
      solution: "The AI handles the call so you never have to put down the scissors.",
      features: [
        "Appointment booking",
        "Service and pricing info",
        "Hours and location questions",
        "Walk-in availability"
      ],
      icon: "barberPole",
      iconColor: "#8B5CF6" // Purple
    },
    {
      title: "Legal",
      problem: "A potential client calls Saturday morning after a DUI arrest the night before. Your office doesn't open until Monday. That's 48 hours for them to find another lawyer.",
      solution: "The AI answers, captures the details, and books a consultation before the weekend is over.",
      features: [
        "Consultation scheduling",
        "Lead intake and qualification",
        "Case status updates",
        "Document request coordination"
      ],
      icon: "gavel",
      iconColor: "#3B82F6" // Blue for legal
    },
    {
      title: "Restaurants",
      problem: "Friday night rush. Your host is seating guests and can't get to the phone. A party of 10 calls to book a reservation—and hangs up when no one answers.",
      solution: "The AI books the reservation so your host can focus on the guests walking in the door.",
      features: [
        "Reservation booking",
        "Takeout and catering orders",
        "Large party and event inquiries",
        "Menu and dietary questions"
      ],
      icon: "plate",
      iconColor: "#EC4899" // Pink for restaurants
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
      {/* Inbound and Outbound Calls Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: spacing.xl,
          marginBottom: spacing['5xl'],
        }}
      >
        {/* Inbound Calls Column */}
        <div
          style={{
            ...plainCardStyles.base,
            borderRadius: borderRadius.xl,
            padding: spacing['3xl'],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                backgroundColor: `${colors.brand[500]}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name="phoneInbound"
                size={isMobile ? 28 : 32}
                color={colors.brand[500]}
                strokeWidth="2"
              />
            </div>
          </div>

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
            Inbound Calls
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
            Enjoy your downtime while the AI handles the phone. No hold times. That's happier customers.
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
            {inboundFeatures.map((item, itemIdx) => (
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
                <span style={{ color: colors.brand[500], marginRight: spacing.xs, fontWeight: typography.fontWeight.bold }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Outbound Calls Column */}
        <div
          style={{
            ...plainCardStyles.base,
            borderRadius: borderRadius.xl,
            padding: spacing['3xl'],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                backgroundColor: `${colors.brand[500]}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name="phoneTransfer"
                size={isMobile ? 28 : 32}
                color={colors.brand[500]}
                strokeWidth="2"
              />
            </div>
          </div>

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
            Outbound Calls
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
            Reduce no-shows by 40% with proactive outreach and automated follow-up.
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
            {outboundFeatures.map((item, itemIdx) => (
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
                <span style={{ color: colors.brand[500], marginRight: spacing.xs, fontWeight: typography.fontWeight.bold }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                  backgroundColor: `${useCase.iconColor}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={useCase.icon}
                  size={isMobile ? 28 : 32}
                  color={useCase.iconColor}
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
                marginBottom: spacing.lg,
                fontFamily: typography.fontFamily.heading,
                letterSpacing: typography.letterSpacing.tight,
                lineHeight: 1.3,
              }}
            >
              {useCase.title}
            </h3>

            {/* Problem Statement (Scenario) - same styling as Solution */}
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: `${useCase.iconColor}08`,
                marginBottom: spacing.md,
                borderLeft: `3px solid ${useCase.iconColor}`,
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  lineHeight: 1.6,
                  margin: 0,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {useCase.problem}
              </p>
            </div>

            {/* Solution Statement */}
            <div
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: `${useCase.iconColor}08`,
                marginBottom: spacing.lg,
                borderLeft: `3px solid ${useCase.iconColor}`,
              }}
            >
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  lineHeight: 1.6,
                  margin: 0,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {useCase.solution}
              </p>
            </div>

            {/* Features List */}
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
                  <span style={{ color: useCase.iconColor, marginRight: spacing.xs, fontWeight: typography.fontWeight.bold }}>•</span>
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
