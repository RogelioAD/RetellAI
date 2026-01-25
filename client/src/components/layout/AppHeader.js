import React from "react";
import { Link } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { colors, spacing, typography, glassStyles, navbarStyles, borderRadius } from "../../constants/horizonTheme";

// Sticky header component with logo, user info, and logout button (glass effect styling)
export default function AppHeader({ user, isAdmin, onLogout }) {
  const { isMobile } = useResponsive();
  const pad = navbarStyles.outerPadding;
  const logo = navbarStyles.logoSize;
  const bar = navbarStyles.barMinHeight;

  const barStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "1400px",
    ...glassStyles.base,
    borderRadius: navbarStyles.borderRadius,
    padding: navbarStyles.barPadding,
    minHeight: isMobile ? bar.mobile : bar.desktop,
    position: "relative",
    zIndex: 1,
    pointerEvents: "auto",
    isolation: "isolate",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        padding: isMobile ? pad.mobile : pad.desktop,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {isMobile ? (
        <div style={barStyle}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src="/logo.png"
              alt="Quantum Consulting Logo"
              loading="lazy"
              decoding="async"
              style={{
                width: logo.mobile,
                height: logo.mobile,
                objectFit: "contain",
              }}
            />
          </Link>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: "rgba(99, 102, 241, 0.15)",
              color: colors.brand[600],
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Icon name="logOut" size={22} color={colors.brand[600]} strokeWidth="2.5" />
          </button>
        </div>
      ) : (
        <div style={{ ...barStyle, gap: spacing.md }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src="/logo.png"
              alt="Quantum Consulting Logo"
              loading="lazy"
              decoding="async"
              style={{
                width: logo.desktop,
                height: logo.desktop,
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
                  fontFamily: typography.fontFamily.display,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                Quantum Consulting
              </h1>
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
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
              
              <Button onClick={onLogout} variant="primary" style={{ minWidth: "auto", padding: `${spacing.md} ${spacing.xl}` }}>
                Logout
              </Button>
            </div>
          </div>
      )}
    </header>
  );
}
