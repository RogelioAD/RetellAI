import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius, plainCardStyles } from "../../../constants/horizonTheme";
import { Link } from "react-router-dom";

export default function Pricing() {
  const { isMobile } = useResponsive();

  const plans = [
    {
      name: "Starter",
      calls: "50 calls",
      price: "$95 / month",
      buttonText: "Get started",
      buttonLink: "/talk-to-sales",
      overage: "Overage: $1.50/call over 50",
      accentColor: "#3B82F6", // Blue
    },
    {
      name: "Basic",
      calls: "150 calls",
      price: "$269 / month",
      buttonText: "Get started",
      buttonLink: "/talk-to-sales",
      overage: "Overage: $1.50/call over 150",
      accentColor: "#EC4899", // Pink
    },
    {
      name: "Enterprise",
      calls: "Custom",
      price: "Ask about enterprise pricing",
      buttonText: "Talk to us",
      buttonLink: "/talk-to-sales",
      overage: "Price adjusted based on your needs",
      accentColor: "#8B5CF6", // Purple
    }
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
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
          Pricing
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
          Choose the plan that fits your business needs
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: spacing.xl,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            style={{
              ...plainCardStyles.base,
              borderRadius: borderRadius.xl,
              border: `2px solid ${plan.accentColor}20`,
              padding: spacing['3xl'],
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: isMobile ? "auto" : "380px",
              justifyContent: "space-between",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${plan.accentColor}20`;
              e.currentTarget.style.borderColor = `${plan.accentColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = `${plan.accentColor}20`;
            }}
          >
            {/* Accent Color Bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: plan.accentColor,
              }}
            />

            {/* Plan Title */}
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                margin: 0,
                marginTop: spacing.md,
                marginBottom: spacing.lg,
                fontFamily: typography.fontFamily.heading,
              }}
            >
              {plan.name}
            </h3>

            {/* Calls/Description */}
            <div
              style={{
                fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: plan.accentColor,
                margin: 0,
                marginBottom: spacing.md,
                fontFamily: typography.fontFamily.display,
                lineHeight: 1.2,
              }}
            >
              {plan.calls}
            </div>

            {/* Price/Sub-description */}
            <div
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.normal,
                color: colors.text.secondary,
                margin: 0,
                marginBottom: spacing['2xl'],
                fontFamily: typography.fontFamily.base,
              }}
            >
              {plan.price}
            </div>

            {/* Button */}
            <Link
              to={plan.buttonLink}
              style={{
                textDecoration: "none",
                width: "100%",
                marginBottom: spacing.lg,
                flexShrink: 0,
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: `${spacing.md} ${spacing.xl}`,
                  backgroundColor: plan.accentColor,
                  color: colors.text.white,
                  border: "none",
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.base,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  const hoverColor = plan.accentColor === "#3B82F6" ? "#2563EB" : 
                                   plan.accentColor === "#EC4899" ? "#DB2777" : "#7C3AED";
                  e.currentTarget.style.backgroundColor = hoverColor;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = plan.accentColor;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.buttonText}
              </button>
            </Link>

            {/* Overage/Additional Info */}
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.normal,
                color: colors.text.secondary,
                margin: 0,
                fontFamily: typography.fontFamily.base,
                lineHeight: 1.5,
              }}
            >
              {plan.overage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
