import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing } from "../../constants/horizonTheme";

/**
 * Loading spinner component with modern animated design
 * 
 * @param {Object} props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} props.color - Color of spinner (default: brand color)
 * @param {string} props.message - Optional message to display below spinner
 * @param {Object} props.style - Additional styles
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = colors.brand[500],
  message = null,
  style = {} 
}) {
  const { isMobile } = useResponsive();

  const sizeMap = {
    sm: { width: '24px', height: '24px', borderWidth: '3px' },
    md: { width: '40px', height: '40px', borderWidth: '4px' },
    lg: { width: '56px', height: '56px', borderWidth: '5px' },
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: message ? spacing.md : 0,
        ...style,
      }}
    >
      <div
        style={{
          width: spinnerSize.width,
          height: spinnerSize.height,
          border: `${spinnerSize.borderWidth} solid ${color}20`,
          borderTop: `${spinnerSize.borderWidth} solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <div
          style={{
            fontSize: isMobile ? '14px' : '16px',
            color: colors.text.secondary,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
