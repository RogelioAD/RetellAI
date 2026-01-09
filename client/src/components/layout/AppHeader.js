import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import { colors, spacing, typography, glassStyles, borderRadius } from "../../constants/horizonTheme";

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
        padding: isMobile ? spacing.lg : spacing.lg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isMobile ? (
        <>
          {/* Glass dock container for mobile */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "calc(100% - 32px)",
              width: "calc(100% - 32px)",
              ...glassStyles.base,
              borderRadius: "36px",
              padding: `${spacing.xs} ${spacing.sm}`,
              position: "relative",
              zIndex: 1,
              pointerEvents: "auto",
              isolation: "isolate",
            }}
          >
            <img
              src="/logo.png"
              alt="Quantum Consulting Logo"
              style={{
                width: "56px",
                height: "56px",
                objectFit: "contain",
              }}
            />
            <Button onClick={onLogout} variant="primary" style={{ minWidth: "auto", padding: `${spacing.sm} ${spacing.md}` }}>
              Logout
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Glass dock container for desktop */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: isMobile ? "calc(100% - 32px)" : "calc(100% - 64px)",
              width: isMobile ? "calc(100% - 32px)" : "calc(100% - 64px)",
              ...glassStyles.base,
              borderRadius: "36px",
              padding: `${spacing.xs} ${spacing.sm}`,
              position: "relative",
              zIndex: 1,
              pointerEvents: "auto",
              isolation: "isolate",
              gap: spacing.md,
            }}
          >
            {/* Logo and app name badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.md,
                width: "fit-content",
                whiteSpace: "nowrap",
                background: "transparent",
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
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  lineHeight: 1,
                }}
              >
                Quantum Consulting
              </h1>
            </div>

            {/* User info badge and logout button grouped together */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              {/* User info badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  background: "transparent",
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
              </div>
              
              <Button onClick={onLogout} variant="primary" style={{ minWidth: "auto", padding: `${spacing.sm} ${spacing.md}` }}>
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
