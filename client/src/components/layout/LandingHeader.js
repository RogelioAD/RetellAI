import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { colors, spacing, typography, glassStyles, navbarStyles, borderRadius } from "../../constants/horizonTheme";

// Header component for landing page with logo, Solutions dropdown, login, and talk-to-sales links
export default function LandingHeader() {
  const { isMobile } = useResponsive();
  const [showSolutions, setShowSolutions] = useState(false);
  const solutionsRef = useRef(null);
  const location = useLocation();
  const pad = navbarStyles.outerPadding;
  const logo = navbarStyles.logoSize;
  const bar = navbarStyles.barMinHeight;

  useEffect(() => {
    setShowSolutions(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target)) {
        setShowSolutions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          ...glassStyles.base,
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
          {/* Solutions dropdown */}
          <div ref={solutionsRef} style={{ position: "relative" }}>
            {isMobile ? (
              <button
                type="button"
                onClick={() => setShowSolutions((prev) => !prev)}
                aria-expanded={showSolutions}
                aria-haspopup="true"
                aria-label="Solutions menu"
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
                <Icon name="globe" size={22} color={colors.brand[600]} strokeWidth="2.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSolutions((prev) => !prev)}
                aria-expanded={showSolutions}
                aria-haspopup="true"
                aria-label="Solutions menu"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.xs,
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.md,
                  border: "none",
                  background: "transparent",
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily.display,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Solutions
                <span
                  style={{
                    display: "inline-flex",
                    transition: "transform 0.2s ease",
                    transform: showSolutions ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <Icon name="chevronDown" size={16} color={colors.text.primary} strokeWidth="2.5" />
                </span>
              </button>
            )}
            {showSolutions && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: isMobile ? 0 : "auto",
                  left: isMobile ? "auto" : 0,
                  marginTop: spacing.sm,
                  minWidth: "160px",
                  padding: spacing.sm,
                  borderRadius: borderRadius.lg,
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.gray[200]}`,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  zIndex: 200,
                }}
              >
                <Link
                  to="/solutions/voice"
                  role="menuitem"
                  style={{
                    display: "block",
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.md,
                    color: colors.text.primary,
                    textDecoration: "none",
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.gray[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Voice
                </Link>
              </div>
            )}
          </div>

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
