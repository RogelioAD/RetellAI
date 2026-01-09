import React from "react";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

/**
 * Badge component for displaying status indicators, roles, and labels
 * Consistent styling across the application
 */
export default function Badge({
  children,
  variant = "default", // default, primary, success, warning, error
  size = "md", // sm, md
  style = {},
  ...props
}) {
  const variants = {
    default: {
      background: `${colors.gray[300]}20`,
      color: colors.text.white,
      border: `1px solid ${colors.gray[300]}`,
    },
    primary: {
      background: `${colors.brand[500]}15`,
      color: colors.brand[500],
      border: `1px solid ${colors.brand[500]}`,
    },
    success: {
      background: `${colors.success}15`,
      color: colors.success,
      border: `1px solid ${colors.success}`,
    },
    warning: {
      background: `${colors.warning}15`,
      color: colors.warning,
      border: `1px solid ${colors.warning}`,
    },
    error: {
      background: `${colors.error}15`,
      color: colors.error,
      border: `1px solid ${colors.error}`,
    },
  };

  const sizes = {
    sm: {
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
    },
    md: {
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
    },
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: borderRadius.sm,
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  return (
    <span style={badgeStyle} {...props}>
      {children}
    </span>
  );
}

