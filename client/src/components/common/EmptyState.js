import React from "react";
import { colors, spacing, typography } from "../../constants/horizonTheme";
import Button from "./Button";
import Icon from "./Icon";

// Empty state component for displaying when no data is available
// icon: Icon name (string) or React element. description: optional secondary text. action: { label, onClick } for CTA.
export default function EmptyState({
  message = "No items found",
  description,
  icon,
  action,
  style = {},
  ...props
}) {
  const iconEl =
    typeof icon === "string" ? (
      <div style={{ marginBottom: spacing.lg, opacity: 0.7 }}>
        <Icon name={icon} size={48} color={colors.text.muted} strokeWidth="1.5" />
      </div>
    ) : icon ? (
      <div style={{ marginBottom: spacing.lg, fontSize: "48px" }}>{icon}</div>
    ) : null;

  return (
    <div
      style={{
        textAlign: "center",
        padding: spacing["4xl"],
        color: colors.text.secondary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
      {...props}
    >
      {iconEl}
      <p
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          margin: 0,
          color: colors.text.primary,
        }}
      >
        {message}
      </p>
      {description && (
        <p
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            margin: 0,
            marginTop: spacing.sm,
            color: colors.text.secondary,
            maxWidth: "320px",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          style={{ marginTop: spacing.xl }}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
