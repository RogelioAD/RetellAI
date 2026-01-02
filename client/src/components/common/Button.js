import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { buttonStyles } from "../../constants/styles";

/**
 * Reusable Button component with responsive design
 */
export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  fullWidth = false,
  ...props
}) {
  const { isMobile } = useResponsive();

  const baseStyle = {
    ...buttonStyles.primary,
    padding: isMobile ? "12px 16px" : "8px 16px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: "100%" }),
    ...props.style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}

