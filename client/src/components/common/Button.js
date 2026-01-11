import React from "react";
import { buttonStyles, colors } from "../../constants/horizonTheme";

// Reusable button component with primary, secondary, and outline variants
const Button = React.forwardRef(function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  variant = "primary",
  style: customStyle = {},
  ...props
}, ref) {
  const [isHovered, setIsHovered] = React.useState(false);

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
      ref={ref}
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
});

export default Button;
