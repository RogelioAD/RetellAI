import React from "react";
import { cardStyles, glassStyles, spacing, borderRadius } from "../../constants/horizonTheme";

// Reusable card component with solid and glass effect variants
export default function Card({
  children,
  padding,
  hover = false,
  variant = "solid",
  style = {},
  onClick,
  className = "",
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  const defaultPadding = padding !== undefined 
    ? padding 
    : variant === "solid" 
      ? spacing['2xl'] 
      : spacing['2xl'];

  // Gets base styles based on variant (solid, glass, glassSubtle, or glassLight)
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
