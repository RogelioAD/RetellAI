import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Icon from "../common/Icon";
import { colors, spacing, typography, shadows } from "../../constants/horizonTheme";

/**
 * Navigation component with Horizon UI styling
 * Sidebar on desktop, bottom nav on mobile
 */
export default function Navigation({ currentSection, onSectionChange, isAdmin }) {
  const { isMobile } = useResponsive();

  const sections = [
    { id: "calls", label: "Calls", icon: "phone" },
    ...(isAdmin ? [{ id: "users", label: "Users", icon: "users" }] : []),
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  if (isMobile) {
    // Bottom navigation for mobile
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: colors.background.card,
          borderTop: `1px solid ${colors.gray[100]}`,
          padding: `${spacing.sm} 0`,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1000,
          boxShadow: "0 -2px 8px rgba(112, 144, 176, 0.08)",
        }}
      >
        {sections.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.md}`,
                background: "transparent",
                border: "none",
                color: isActive ? colors.brand[500] : colors.text.secondary,
                fontSize: typography.fontSize.xs,
                fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "3px",
                    borderRadius: "0 0 3px 3px",
                    background: colors.brand[500],
                  }}
                />
              )}
              <Icon name={section.icon} size={20} color={isActive ? colors.brand[500] : colors.text.secondary} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Sidebar navigation for desktop
  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: colors.background.card,
        borderRight: `1px solid ${colors.gray[100]}`,
        padding: `${spacing['2xl']} ${spacing.lg}`,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xs,
      }}
    >
      {sections.map((section) => {
        const isActive = currentSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            style={{
              width: "100%",
              padding: `${spacing.md} ${spacing.lg}`,
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              background: isActive ? colors.brand[500] : "transparent",
              border: "none",
              borderRadius: "12px",
              color: isActive ? colors.text.white : colors.text.secondary,
              fontSize: typography.fontSize.sm,
              fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
              boxShadow: isActive ? shadows.sm : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.background = colors.gray[50];
                e.target.style.color = colors.text.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.background = "transparent";
                e.target.style.color = colors.text.secondary;
              }
            }}
          >
            <Icon 
              name={section.icon} 
              size={18} 
              color={isActive ? colors.text.white : colors.text.secondary} 
            />
            <span>{section.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
