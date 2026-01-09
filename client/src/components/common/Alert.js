import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

/**
 * Alert component for displaying error, success, warning, and info messages
 * Consistent styling and positioning across the application
 */
export default function Alert({
  children,
  variant = "error", // error, success, warning, info
  style = {},
  ...props
}) {
  const { isMobile } = useResponsive();

  const variants = {
    error: {
      color: colors.error,
      background: `${colors.error}08`,
      border: `1px solid ${colors.error}`,
    },
    success: {
      color: colors.success,
      background: `${colors.success}08`,
      border: `1px solid ${colors.success}`,
    },
    warning: {
      color: colors.warning,
      background: `${colors.warning}08`,
      border: `1px solid ${colors.warning}`,
    },
    info: {
      color: colors.info,
      background: `${colors.info}08`,
      border: `1px solid ${colors.info}`,
    },
  };

  const alertStyle = {
    padding: isMobile ? spacing.md : spacing.lg,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    ...variants[variant],
    ...style,
  };

  return (
    <div style={alertStyle} {...props}>
      {children}
    </div>
  );
}

