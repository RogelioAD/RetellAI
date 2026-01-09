import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import { colors, spacing, typography, shadows, glassStyles, borderRadius } from "../../constants/horizonTheme";

/**
 * Sticky header component with Horizon UI styling
 * Clean, modern header with user profile actions
 */
export default function AppHeader({ user, isAdmin, onLogout }) {
  const { isMobile } = useResponsive();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: isMobile ? `${spacing.lg} ${spacing.xl}` : `${spacing.lg} ${spacing['3xl']}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: shadows.sm,
      }}
    >
      {/* Overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: -1,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: spacing.md, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.xs,
            padding: `${spacing.sm} ${spacing.md}`,
            ...glassStyles.base,
            borderRadius: borderRadius.md,
          }}
        >
          <img
            src="/logo.png"
            alt="Quantum Consulting Logo"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
            }}
          />
            <h1
            style={{
              margin: 0,
              fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              lineHeight: 1,
            }}
          >
            Quantum Consulting
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing.md,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.sm,
            padding: `${spacing.sm} ${spacing.md}`,
            ...glassStyles.base,
            borderRadius: borderRadius.md,
            marginRight: isMobile ? 0 : spacing.sm,
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: colors.brand[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.text.white,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            {(user?.username || "U").charAt(0).toUpperCase()}
          </div>
          {!isMobile && (
            <div>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.primary,
                  fontWeight: typography.fontWeight.bold,
                }}
              >
                {user?.username || "User"}
              </div>
              {isAdmin && (
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  Admin
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button onClick={onLogout} variant="primary">
          Logout
        </Button>
      </div>
    </header>
  );
}
