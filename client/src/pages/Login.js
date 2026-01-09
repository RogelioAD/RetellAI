import React, { useState, useEffect } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { login } from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import { colors, spacing, typography, borderRadius } from "../constants/horizonTheme";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Login form component with account lockout protection after failed attempts.
 */
export default function Login({ onLogin, onNavigateToHome }) {
  const { isMobile } = useResponsive();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Check lockout status on mount and set up timer
  useEffect(() => {
    const checkLockout = () => {
      const lockoutData = localStorage.getItem("loginLockout");
      if (lockoutData) {
        const { lockoutUntil } = JSON.parse(lockoutData);
        const now = Date.now();
        const remaining = lockoutUntil - now;

        if (remaining > 0) {
          setIsLockedOut(true);
          setTimeRemaining(remaining);
        } else {
          localStorage.removeItem("loginLockout");
          localStorage.removeItem("failedLoginAttempts");
          setIsLockedOut(false);
          setTimeRemaining(0);
          setError(null);
        }
      } else if (isLockedOut) {
        setIsLockedOut(false);
        setTimeRemaining(0);
        setError(null);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [isLockedOut]);

  /**
   * Formats milliseconds to MM:SS format for lockout timer display.
   */
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /**
   * Handles login form submission with attempt tracking and lockout logic.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isLockedOut) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login({ username, password });
      localStorage.removeItem("failedLoginAttempts");
      localStorage.removeItem("loginLockout");
      setIsLockedOut(false);
      setTimeRemaining(0);
      onLogin(res);
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      const isServerRateLimitMessage = errorMessage.toLowerCase().includes("too many login attempts") || 
                                       errorMessage.toLowerCase().includes("try again later");
      
      const attemptsData = localStorage.getItem("failedLoginAttempts");
      const attempts = attemptsData ? parseInt(attemptsData, 10) : 0;
      const newAttempts = attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem("loginLockout", JSON.stringify({ lockoutUntil }));
        localStorage.setItem("failedLoginAttempts", newAttempts.toString());
        setIsLockedOut(true);
        setTimeRemaining(LOCKOUT_DURATION_MS);
        setError(null);
      } else {
        localStorage.setItem("failedLoginAttempts", newAttempts.toString());
        if (!isServerRateLimitMessage) {
          setError(errorMessage);
        } else {
          setError("Invalid username or password");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url('/colorful.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      padding: isMobile ? spacing.xl : spacing['4xl'],
      position: "relative",
    }}>
      {/* Overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(244, 247, 254, 0.4)",
        zIndex: 0,
      }} />
      <Card
        variant="glass"
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: isMobile ? spacing['2xl'] : spacing['3xl'],
          position: "relative",
          zIndex: 1,
          borderRadius: borderRadius.xl,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: spacing['2xl'] }}>
          <img
            src="/logo.png"
            alt="Quantum Consulting Logo"
            style={{
              width: "64px",
              height: "64px",
              objectFit: "contain",
              marginBottom: spacing.md,
            }}
          />
          <h2 style={{ 
            fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'], 
            marginTop: 0,
            marginBottom: 0,
            color: colors.text.white,
            fontWeight: typography.fontWeight.bold,
          }}>
            Welcome Back
          </h2>
        </div>

        {isLockedOut && (
          <Alert variant="error" style={{ marginBottom: spacing.xl, textAlign: "center" }}>
            <div style={{ 
              fontWeight: typography.fontWeight.semibold, 
              marginBottom: spacing.sm, 
              fontSize: typography.fontSize.sm,
            }}>
              Account Temporarily Locked
            </div>
            <div style={{ 
              color: colors.text.white, 
              marginBottom: spacing.md,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}>
              Password has been incorrect multiple times. Please try again after:
            </div>
            <div style={{
              fontSize: isMobile ? typography.fontSize.xl : typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              marginTop: spacing.sm,
            }}>
              {formatTime(timeRemaining)}
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading || isLockedOut}
            placeholder="Enter your username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || isLockedOut}
            placeholder="Enter your password"
          />
          
          <div style={{
            display: "flex",
            gap: spacing.md,
            marginTop: spacing.lg,
          }}>
            {onNavigateToHome && (
              <Button
                type="button"
                onClick={onNavigateToHome}
                disabled={loading || isLockedOut}
                variant="primary"
                fullWidth
              >
                Home
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || isLockedOut}
              variant="primary"
              fullWidth
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
          
          {error && (
            <Alert variant="error" style={{ marginTop: spacing.md }}>
              {error}
            </Alert>
          )}
        </form>
      </Card>
    </div>
  );
}
