import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Button from "../common/Button";
import AtomIcon from "../common/AtomIcon";

/**
 * Sticky header component for the application
 */
export default function AppHeader({ user, isAdmin, onLogout }) {
  const { isMobile } = useResponsive();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: isMobile ? "16px 20px" : "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "32px" : "36px",
              height: isMobile ? "32px" : "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              padding: "6px",
            }}
          >
            <AtomIcon size={isMobile ? 20 : 24} color="#667eea" />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "1.25em" : "1.5em",
              fontWeight: 600,
              color: "#f4f4f5",
            }}
          >
            Retell AI
          </h1>
        </div>
        {isAdmin && (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: "0.75em",
              background: "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(211, 47, 47, 0.2) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              color: "#ffcdd2",
              fontWeight: 500,
            }}
          >
            Admin
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginRight: isMobile ? 0 : "12px",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "0.9em" : "0.95em",
              color: "#f4f4f5",
              fontWeight: 500,
            }}
          >
            {user?.username || "User"}
          </span>
          {user?.email && (
            <span
              style={{
                fontSize: "0.8em",
                color: "#71717a",
                marginTop: "2px",
              }}
            >
              {user.email}
            </span>
          )}
        </div>
        <Button onClick={onLogout} style={{ fontSize: isMobile ? "13px" : "14px" }}>
          Logout
        </Button>
      </div>
    </header>
  );
}

