import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography } from "../../constants/horizonTheme";

/**
 * EmptyState component for consistent empty state displays
 * Used when lists, tables, or content areas are empty
 */
export default function EmptyState({
  message = "No items found",
  icon,
  style = {},
  ...props
}) {
  const { isMobile } = useResponsive();

  const emptyStateStyle = {
    textAlign: "center",
    padding: isMobile ? `${spacing['3xl']} ${spacing.xl}` : `${spacing['5xl']} ${spacing['2xl']}`,
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    ...style,
  };

  return (
    <div style={emptyStateStyle} {...props}>
      {icon && (
        <div style={{ marginBottom: spacing.md, fontSize: "48px" }}>
          {icon}
        </div>
      )}
      {message}
    </div>
  );
}

