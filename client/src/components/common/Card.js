import React from "react";
import { cardStyles, glassStyles, spacing, borderRadius } from "../../constants/horizonTheme";

/**
 * Reusable card component with solid and glass effect variants.
 */
export default function Card({
  children,
  padding,
  hover = false,
  variant = "solid", // solid, glass, glassSubtle, glassLight
  style = {},
  onClick,
  className = "",
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Default padding based on variant
  const defaultPadding = padding !== undefined 
    ? padding 
    : variant === "solid" 
      ? spacing['2xl'] 
      : spacing['2xl'];

  // Get base styles based on variant
  const getBaseStyle = () => {
    switch (variant) {
      case "glass":
        return glassStyles.base;
      case "glassSubtle":
        return glassStyles.subtle;
      case "glassLight":
        return glassStyles.light;
      default:
        return cardStyles.base;
    }
  };

  const baseStyle = {
    ...getBaseStyle(),
    // Apply border-radius based on variant (glass variants need explicit radius)
    borderRadius: variant !== "solid" ? borderRadius.xl : cardStyles.base.borderRadius,
    padding: defaultPadding,
    ...(hover && isHovered && cardStyles.hover),
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
}

