import React from "react";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Alert component for displaying success, error, warning, or info messages
export default function Alert({ children, variant = "info", style = {}, ...props }) {
  const variantStyles = {
    success: {
      backgroundColor: colors.success[50],
      borderColor: colors.success[200],
      color: colors.success[700],
    },
    error: {
      backgroundColor: colors.error[50],
      borderColor: colors.error[200],
      color: colors.error[700],
    },
    warning: {
      backgroundColor: colors.warning[50],
      borderColor: colors.warning[200],
      color: colors.warning[700],
    },
    info: {
      backgroundColor: colors.info[50],
      borderColor: colors.info[200],
      color: colors.info[700],
    },
  };

  const baseStyle = {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `1px solid ${variantStyles[variant].borderColor}`,
    backgroundColor: variantStyles[variant].backgroundColor,
    color: variantStyles[variant].color,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
}
