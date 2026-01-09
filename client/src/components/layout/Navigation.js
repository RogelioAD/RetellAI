import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Icon from "../common/Icon";
import { colors, spacing, typography, glassStyles, borderRadius } from "../../constants/horizonTheme";

/**
 * Navigation component with Horizon UI styling
 * Sidebar on desktop, bottom nav on mobile
 */
export default function Navigation({ currentSection, onSectionChange, isAdmin }) {
  const { isMobile } = useResponsive();
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    { id: "calls", label: "Calls", icon: "phone" },
    ...(isAdmin ? [{ id: "users", label: "Users", icon: "users" }] : []),
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  // Bottom navigation for both mobile and desktop - centered bubble
  return (
    <nav
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: isMobile ? "calc(100% - 32px)" : "500px",
        width: isMobile ? "calc(100% - 32px)" : "auto",
        minWidth: isMobile ? "auto" : "300px",
        ...glassStyles.base,
        borderRadius: "36px",
        padding: `${spacing.xs} ${spacing.sm}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
        pointerEvents: "auto",
        isolation: "isolate",
      }}
    >
      {sections.map((section) => {
        const isActive = currentSection === section.id;
        const isHovered = hoveredSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: `${spacing.sm} ${spacing.xs}`,
              ...(isActive ? glassStyles.active : { 
                background: isHovered ? "rgba(99, 102, 241, 0.1)" : "transparent", 
                border: isHovered ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid transparent" 
              }),
              borderRadius: borderRadius.lg,
              color: isActive || isHovered ? colors.brand[600] : colors.text.secondary,
              fontSize: typography.fontSize.xs,
              fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              outline: "none",
              pointerEvents: "auto",
              overflow: "visible",
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoveredSection(section.id);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setHoveredSection(null);
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: borderRadius.md,
              backgroundColor: isActive ? `${colors.brand[500]}25` : (isHovered ? `${colors.brand[500]}15` : "transparent"),
              boxShadow: isActive ? `0 2px 12px ${colors.brand[500]}40` : (isHovered ? `0 2px 8px ${colors.brand[500]}25` : "none"),
              transition: "all 0.3s ease",
              border: isActive ? `2px solid ${colors.brand[500]}40` : "none",
            }}>
              <Icon 
                name={section.icon} 
                size={22} 
                color={isActive ? colors.brand[600] : (isHovered ? colors.brand[500] : colors.text.primary)}
                strokeWidth="2.5"
              />
            </div>
            <span style={{ fontSize: typography.fontSize.xs }}>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
