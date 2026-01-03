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
  style: customStyle = {},
  ...props
}) {
  const { isMobile } = useResponsive();

  // Check if custom background is provided (don't override hover if it is)
  const hasCustomBackground = customStyle?.background !== undefined;
  
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
    background: hasCustomBackground ? customStyle.background : (customStyle.background || buttonStyles.primary.background),
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
    
    // Only apply hover effects if no custom background was provided
    if (!hasCustomBackground) {
      e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)";
      e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      e.target.style.transform = "translateY(-1px) scale(1.02)";
      e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1) inset";
    } else {
      // Even with custom background, add subtle hover effect
      e.target.style.transform = "translateY(-1px) scale(1.01)";
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    
    // Only reset hover effects if no custom background was provided
    if (!hasCustomBackground) {
      e.target.style.background = originalBackground;
      e.target.style.border = originalBorder;
      e.target.style.transform = originalTransform;
      e.target.style.boxShadow = originalBoxShadow;
    } else {
      // Reset subtle hover effect
      e.target.style.transform = originalTransform;
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

