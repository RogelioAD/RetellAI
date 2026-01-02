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
      <h2 style={{ fontSize: isMobile ? "1.5em" : "1.8em", marginTop: 0 }}>
        Customer Login
      </h2>
      {isLockedOut && (
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          padding: isMobile ? "12px" : "16px",
          marginBottom: "20px",
          color: "#856404",
          fontSize: isMobile ? "14px" : "15px",
          textAlign: "center"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Account Temporarily Locked
          </div>
          <div>
            Password has been incorrect multiple times. Please try again after:
          </div>
          <div style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "bold",
            marginTop: "8px",
            color: "#d9534f"
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
            color: "red", 
            marginTop: 12,
            fontSize: isMobile ? "14px" : "14px"
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
