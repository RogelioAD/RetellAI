import React from "react";
import { colors, spacing, typography } from "../../constants/horizonTheme";

// Empty state component for displaying when no data is available
export default function EmptyState({
  message = "No items found",
  icon,
  style = {},
  ...props
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: spacing['4xl'],
        color: colors.text.secondary,
        ...style,
      }}
      {...props}
    >
      {icon && (
        <div style={{ marginBottom: spacing.lg, fontSize: "48px" }}>
          {icon}
        </div>
      )}
      <p
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          margin: 0,
        }}
      >
        {message}
      </p>
    </div>
  );
}
