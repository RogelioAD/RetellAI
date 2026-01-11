import React from "react";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Badge component for displaying small labels or status indicators
export default function Badge({ children, variant = "default", style = {}, ...props }) {
  const variantStyles = {
    default: {
      backgroundColor: colors.gray[100],
      color: colors.gray[700],
    },
    primary: {
      backgroundColor: colors.brand[100],
      color: colors.brand[700],
    },
    success: {
      backgroundColor: colors.success[100],
      color: colors.success[700],
    },
    error: {
      backgroundColor: colors.error[100],
      color: colors.error[700],
    },
    warning: {
      backgroundColor: colors.warning[100],
      color: colors.warning[700],
    },
  };

  const baseStyle = {
    display: "inline-block",
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span style={baseStyle} {...props}>
      {children}
    </span>
  );
}
