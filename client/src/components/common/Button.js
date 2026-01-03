import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { buttonStyles, gradients } from "../../constants/styles";

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
    padding: isMobile ? "12px 20px" : "10px 20px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: "100%" }),
    ...props.style
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !props.style?.background) {
      e.target.style.background = gradients.buttonHover;
      e.target.style.transform = "translateY(-1px)";
      e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !props.style?.background) {
      e.target.style.background = gradients.button;
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}

