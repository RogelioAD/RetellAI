import React from "react";
import { cardStyles } from "../../constants/horizonTheme";

/**
 * Reusable Card component with Horizon UI styling
 * Clean card-based layout with soft shadows and rounded corners
 */
export default function Card({
  children,
  padding = "24px",
  hover = false,
  style = {},
  onClick,
  className = "",
  ...props
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle = {
    ...cardStyles.base,
    padding,
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

