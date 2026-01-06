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
  fullWidth = false,
  style: customStyle = {},
  ...props
}) {
  const { isMobile } = useResponsive();
  
  // Build base style - explicitly set all properties, then apply custom overrides
  const baseStyle = {
    // Start with all primary button styles
    ...buttonStyles.primary,
    // Override with responsive and state properties
    padding: isMobile ? "12px 20px" : "12px 20px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: "100%" }),
    // Apply custom styles (for properties like fontSize that should be overridable)
    ...customStyle,
    // Explicitly re-set critical visual properties AFTER custom styles (so they can't be removed)
    background: customStyle.background || buttonStyles.primary.background,
    border: customStyle.border || buttonStyles.primary.border,
    color: customStyle.color || buttonStyles.primary.color,
    backdropFilter: customStyle.backdropFilter || buttonStyles.primary.backdropFilter,
    WebkitBackdropFilter: customStyle.WebkitBackdropFilter || buttonStyles.primary.WebkitBackdropFilter,
    borderRadius: customStyle.borderRadius || buttonStyles.primary.borderRadius,
    boxShadow: customStyle.boxShadow || buttonStyles.primary.boxShadow,
  };

  // Store original styles to ensure proper reset
  const originalBackground = baseStyle.background;
  const originalBorder = baseStyle.border;
  const originalBoxShadow = baseStyle.boxShadow;
  const originalTransform = baseStyle.transform || "translateY(0) scale(1)";

  const handleMouseEnter = (e) => {
    if (disabled) return;
    
    // Apply consistent hover effect to all buttons
    e.target.style.background = "rgba(255, 255, 255, 0.12)";
    e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    e.target.style.transform = "translateY(-1px) scale(1.01)";
    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    
    // Reset to original styles
    e.target.style.background = originalBackground;
    e.target.style.border = originalBorder;
    e.target.style.transform = originalTransform;
    e.target.style.boxShadow = originalBoxShadow;
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

