import React from "react";
import { buttonStyles, colors } from "../../constants/horizonTheme";

/**
 * Reusable button component with primary, secondary, and outline variants.
 */
export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  variant = "primary", // primary, secondary, outline
  style: customStyle = {},
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Get variant-specific styles
  const variantStyles = {
    primary: {
      ...buttonStyles.base,
      ...buttonStyles.primary,
    },
    secondary: {
      ...buttonStyles.base,
      ...buttonStyles.secondary,
    },
    outline: {
      ...buttonStyles.base,
      ...buttonStyles.outline,
    },
  };

  const baseStyle = {
    ...variantStyles[variant],
    ...(fullWidth && { width: "100%" }),
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ...customStyle,
  };

  // Hover styles
  const hoverStyle = {
    primary: {
      backgroundColor: colors.brand[600],
      transform: "translateY(-1px)",
      boxShadow: "0px 4px 12px rgba(66, 42, 251, 0.3)",
    },
    secondary: {
      backgroundColor: colors.gray[200],
      transform: "translateY(-1px)",
    },
    outline: {
      backgroundColor: colors.gray[50],
      borderColor: colors.brand[500],
      color: colors.brand[600],
    },
  };

  const currentStyle = {
    ...baseStyle,
    ...(isHovered && !disabled && hoverStyle[variant]),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
