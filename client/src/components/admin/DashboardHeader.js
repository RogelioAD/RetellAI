import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";

/**
 * Header component for the dashboard with responsive design
 */
export default function DashboardHeader({ 
  user, 
  isAdmin, 
  onLogout, 
  onToggleUserManagement, 
  showUserManagement,
  onTogglePasswordChange,
  showPasswordChange
}) {
  const { isMobile } = useResponsive();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? "12px" : "8px",
        marginBottom: isMobile ? "16px" : "0"
      }}
    >
      <h2 style={{ 
        margin: 0,
        fontSize: isMobile ? "1.5em" : "1.75em",
        wordBreak: "break-word",
        fontWeight: 700,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        Dashboard — {user?.username || "User"}
        {isAdmin && (
          <span style={{ 
            marginLeft: 8, 
            fontSize: isMobile ? "0.65em" : "0.7em", 
            color: "#6b7280",
            display: isMobile ? "block" : "inline",
            fontWeight: 500
          }}>
            (Admin)
          </span>
        )}
      </h2>
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "8px" : "8px",
        width: isMobile ? "100%" : "auto"
      }}>
        {isAdmin && (
          <Button 
            onClick={onToggleUserManagement}
            fullWidth={isMobile}
            style={{ fontSize: isMobile ? "14px" : "14px" }}
          >
            {showUserManagement ? "Hide Users" : "Manage Users"}
          </Button>
        )}
        {!isAdmin && (
          <Button 
            onClick={onTogglePasswordChange}
            fullWidth={isMobile}
            style={{ fontSize: isMobile ? "14px" : "14px" }}
          >
            Change Password
          </Button>
        )}
        <Button 
          onClick={onLogout}
          fullWidth={isMobile}
          style={{ fontSize: isMobile ? "14px" : "14px" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

