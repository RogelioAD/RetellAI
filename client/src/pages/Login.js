import React, { useState, useEffect } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { login } from "../services/api";
import Input from "../components/common/Input";
import { layoutStyles } from "../constants/styles";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Login page component with responsive design
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
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url('/colorful.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      padding: isMobile ? "20px" : "40px",
      position: "relative"
    }}>
      <div style={{
        ...layoutStyles.login,
        ...(isMobile && layoutStyles.loginMobile),
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
      }}>
      <h2 style={{ 
        fontSize: isMobile ? "1.5em" : "1.8em", 
        marginTop: 0,
        color: "#ffffff",
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
        <div style={{
          display: "flex",
          gap: "12px",
          marginTop: "8px"
        }}>
          {onNavigateToHome && (
            <button
              type="button"
              onClick={onNavigateToHome}
              disabled={loading || isLockedOut}
              style={{
                flex: 1,
                padding: isMobile ? "12px 20px" : "12px 20px",
                fontSize: isMobile ? "14px" : "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                color: "#ffffff",
                borderRadius: "12px",
                cursor: loading || isLockedOut ? "not-allowed" : "pointer",
                fontWeight: 400,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                position: "relative",
                overflow: "hidden",
                opacity: loading || isLockedOut ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading && !isLockedOut) {
                  e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(-1px) scale(1.02)";
                  e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && !isLockedOut) {
                  e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
                }
              }}
            >
              Home
            </button>
          )}
          <button
            type="submit"
            disabled={loading || isLockedOut}
            style={{
              flex: 1,
              padding: isMobile ? "12px 20px" : "12px 20px",
              fontSize: isMobile ? "14px" : "14px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "#ffffff",
              borderRadius: "12px",
              cursor: loading || isLockedOut ? "not-allowed" : "pointer",
              fontWeight: 400,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              position: "relative",
              overflow: "hidden",
              opacity: loading || isLockedOut ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading && !isLockedOut) {
                e.target.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 50%, rgba(240, 147, 251, 0.2) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
                e.target.style.color = "#ffffff";
                e.target.style.fontWeight = 500;
                e.target.style.transform = "translateY(-1px) scale(1.02)";
                e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.35)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && !isLockedOut) {
                e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.color = "#ffffff";
                e.target.style.fontWeight = 400;
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
              }
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
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
    </div>
  );
}
