import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { colors, spacing, typography, shadows, glassStyles, navbarStyles, borderRadius } from "../../constants/horizonTheme";

// Hero is 85vh; use same ratio so navbar switches to glass once user scrolls past hero
const HERO_VIEWPORT_RATIO = 0.85;

// Header component for landing page with logo, Solutions dropdown, login, and talk-to-sales links
export default function LandingHeader() {
  const { isMobile } = useResponsive();
  const [isOverHero, setIsOverHero] = useState(true);
  const location = useLocation();
  const pad = navbarStyles.outerPadding;
  const logo = navbarStyles.logoSize;
  const bar = navbarStyles.barMinHeight;

  // On home page: white bar over hero, liquid glass after scrolling past hero. Other pages: always glass.
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsOverHero(false);
      return;
    }
    const update = () => {
      const heroHeight = window.innerHeight * HERO_VIEWPORT_RATIO;
      setIsOverHero(window.scrollY < heroHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [location.pathname]);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1400px",
          ...(location.pathname === "/" && isOverHero
            ? {
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: shadows.sm,
                transition: "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
              }
            : glassStyles.base),
          borderRadius: navbarStyles.borderRadius,
          padding: navbarStyles.barPadding,
          minHeight: isMobile ? bar.mobile : bar.desktop,
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : spacing.md, textDecoration: "none", color: "inherit" }}>
          <img
            src="/logo.png"
            alt="Quantum Consulting Logo"
            loading="lazy"
            decoding="async"
            style={{
              width: isMobile ? logo.mobile : logo.desktop,
              height: isMobile ? logo.mobile : logo.desktop,
              objectFit: "contain",
            }}
          />
          {!isMobile && (
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
          )}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          {/* Voice link (single service) */}
          <Link to="/solutions/voice" style={{ textDecoration: "none" }}>
            {isMobile ? (
              <button
                type="button"
                aria-label="Voice"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(139, 92, 246, 0.15)",
                  color: colors.brand[600],
                  cursor: "pointer",
                  padding: 0,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.15)";
                }}
              >
                <Icon name="phone" size={22} color={colors.brand[600]} strokeWidth="2.5" />
              </button>
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.display,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Voice
              </span>
            )}
          </Link>

          {/* Pricing Link */}
          {isMobile ? (
            <Link
              to="/pricing"
              style={{ textDecoration: "none" }}
            >
              <button
                type="button"
                aria-label="Pricing"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#3B82F6",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
                }}
              >
                <Icon name="dollar" size={22} color="#3B82F6" strokeWidth="2.5" />
              </button>
            </Link>
          ) : (
            <Link
              to="/pricing"
              style={{
                textDecoration: "none",
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.display,
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Pricing
            </Link>
          )}

          <Link to="/login" style={{ textDecoration: "none" }}>
            {isMobile ? (
              <button
                type="button"
                aria-label="Login"
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
                <Icon name="user" size={22} color={colors.brand[600]} strokeWidth="2.5" />
              </button>
            ) : (
              <Button variant="primary" style={{ minWidth: "auto", padding: `${spacing.md} ${spacing.xl}` }}>
                Login
              </Button>
            )}
          </Link>
          <Link to="/talk-to-sales" style={{ textDecoration: "none" }}>
            {isMobile ? (
              <button
                type="button"
                aria-label="Talk to Sales"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `2px solid ${colors.brand[200]}`,
                  background: "transparent",
                  color: colors.text.primary,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Icon name="arrowDownRight" size={20} color={colors.text.primary} strokeWidth="2.5" />
              </button>
            ) : (
              <Button
                variant="outline"
                style={{
                  minWidth: "auto",
                  padding: `${spacing.md} ${spacing.xl}`,
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                }}
              >
                <Icon name="arrowDownRight" size={16} color={colors.text.primary} />
                Talk to Sales
              </Button>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
