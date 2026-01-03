import React from "react";

/**
 * Atom icon component - SVG icon for the logo
 */
export default function AtomIcon({ size = 24, color = "#667eea" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Atom nucleus (center circle) */}
      <circle cx="12" cy="12" r="2" fill={color} />
      
      {/* Electron orbits (ellipses) */}
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        transform="rotate(120 12 12)"
      />
      
      {/* Electron dots on orbits */}
      <circle cx="22" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="16" r="1.5" fill={color} />
      <circle cx="2" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="8" r="1.5" fill={color} />
      <circle cx="18.93" cy="6" r="1.5" fill={color} />
      <circle cx="18.93" cy="18" r="1.5" fill={color} />
      <circle cx="5.07" cy="6" r="1.5" fill={color} />
      <circle cx="5.07" cy="18" r="1.5" fill={color} />
    </svg>
  );
}

