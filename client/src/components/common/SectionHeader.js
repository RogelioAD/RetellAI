import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography } from "../../constants/horizonTheme";

/**
 * SectionHeader component for consistent page and section titles
 * Standardizes typography, spacing, and hierarchy across the app
 */
export default function SectionHeader({
  title,
  subtitle,
  level = 1, // 1 = page title, 2 = section title, 3 = subsection
  style = {},
  ...props
}) {
  const { isMobile } = useResponsive();

  const styles = {
    1: {
      fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing['2xl'],
      marginTop: 0,
    },
    2: {
      fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.lg,
      marginTop: 0,
    },
    3: {
      fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing.md,
      marginTop: 0,
    },
  };

  const headerStyle = {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    ...styles[level],
    ...style,
  };

  const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';

  return (
    <div {...props}>
      <Tag style={headerStyle}>{title}</Tag>
      {subtitle && (
        <p style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
          fontWeight: typography.fontWeight.medium,
          marginTop: spacing.xs,
          marginBottom: 0,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

