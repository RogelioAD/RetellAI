import React, { useState, useEffect } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { login } from "../services/api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { layoutStyles } from "../constants/styles";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Login page component with responsive design
 */
export default function Login({ onLogin }) {
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
          // Lockout expired, clear it
          localStorage.removeItem("loginLockout");
          localStorage.removeItem("failedLoginAttempts");
          setIsLockedOut(false);
          setTimeRemaining(0);
          setError(null); // Clear any error messages when lockout expires
        }
      } else if (isLockedOut) {
        // If no lockout data but state says locked out, reset state
        setIsLockedOut(false);
        setTimeRemaining(0);
        setError(null); // Clear any error messages
      }
    };

    // Check immediately on mount
    checkLockout();
    
    // Set up interval to update timer every second
    const interval = setInterval(checkLockout, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isLockedOut) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login({ username, password });
      // Successful login - reset failed attempts
      localStorage.removeItem("failedLoginAttempts");
      localStorage.removeItem("loginLockout");
      setIsLockedOut(false);
      setTimeRemaining(0);
      onLogin(res);
    } catch (err) {
      // Filter out server rate limiter messages since we handle lockout client-side
      const errorMessage = err.message || "Login failed";
      const isServerRateLimitMessage = errorMessage.toLowerCase().includes("too many login attempts") || 
                                       errorMessage.toLowerCase().includes("try again later");
      
      // Increment failed attempts
      const attemptsData = localStorage.getItem("failedLoginAttempts");
      const attempts = attemptsData ? parseInt(attemptsData, 10) : 0;
      const newAttempts = attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock out the user
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem("loginLockout", JSON.stringify({ lockoutUntil }));
        localStorage.setItem("failedLoginAttempts", newAttempts.toString());
        setIsLockedOut(true);
        setTimeRemaining(LOCKOUT_DURATION_MS);
        setError(null); // Don't show error message when locked out, the banner handles it
      } else {
        localStorage.setItem("failedLoginAttempts", newAttempts.toString());
        // Only show error if it's not a server rate limit message (we handle that ourselves)
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
      ...layoutStyles.login,
      ...(isMobile && layoutStyles.loginMobile)
    }}>
      <h2 style={{ 
        fontSize: isMobile ? "1.5em" : "1.8em", 
        marginTop: 0,
        color: "#f4f4f5",
        fontWeight: 600
      }}>
        Customer Login
      </h2>
      {isLockedOut && (
        <div style={{
          background: "rgba(244, 67, 54, 0.1)",
          border: "1px solid rgba(244, 67, 54, 0.3)",
          borderRadius: "12px",
          padding: isMobile ? "16px" : "20px",
          marginBottom: "20px",
          color: "#ffcdd2",
          fontSize: isMobile ? "14px" : "15px",
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ fontWeight: 600, marginBottom: "8px", color: "#fca5a5" }}>
            Account Temporarily Locked
          </div>
          <div style={{ color: "#d4d4d8", marginBottom: "12px" }}>
            Password has been incorrect multiple times. Please try again after:
          </div>
          <div style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "600",
            marginTop: "8px",
            color: "#ffcdd2"
          }}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading || isLockedOut}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || isLockedOut}
        />
        <Button
          type="submit"
          disabled={loading || isLockedOut}
          fullWidth
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        {error && (
          <div style={{ 
            color: "#fca5a5", 
            marginTop: 12,
            fontSize: isMobile ? "14px" : "14px",
            padding: "12px",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 8
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
