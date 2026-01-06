import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formatShortDate } from "../../utils/dateFormatters";
import Button from "../common/Button";

/**
 * Table component for displaying users with responsive design
 */
export default function UserTable({ users, loading, onDeleteUser, currentUserId }) {
  const { isMobile } = useResponsive();
  const [deletingUserId, setDeletingUserId] = useState(null);

  if (loading) {
    return <div style={{ padding: isMobile ? "16px" : "20px", color: "#71717a" }}>Loading users...</div>;
  }

  if (users.length === 0) {
    return <div style={{ padding: isMobile ? "16px" : "20px", color: "#71717a" }}>No users found.</div>;
  }

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`You as the admin can still view and access call transcripts and any other related information to the user. However, once deleted this deactivates the user's account and their ability to access their transcripts. Are you sure you want to delete "${username}"?`)) {
      return;
    }
    
    setDeletingUserId(userId);
    try {
      await onDeleteUser(userId);
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div>
        <h4 style={{ fontSize: "1.1em", marginBottom: 12, color: "#f4f4f5", fontWeight: 500 }}>All Users ({users.length})</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {users.filter(u => u && u.id).map((u) => {
            const canDelete = u.role !== "admin" && u.id !== currentUserId;
            return (
              <div
                key={u.id}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset"
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: "0.9em", color: "#a1a1aa" }}>Username:</strong>
                  <div style={{ fontSize: "1em", marginTop: 4, color: "#f4f4f5" }}>{u.username || "-"}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: "0.9em", color: "#a1a1aa" }}>Email:</strong>
                  <div style={{ fontSize: "1em", marginTop: 4, color: "#f4f4f5" }}>{u.email || "-"}</div>
                </div>
                <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "0.9em", color: "#a1a1aa" }}>Role:</strong>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: 6, 
                    fontSize: "0.85em",
                    background: u.role === "admin" 
                      ? "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(211, 47, 47, 0.2) 100%)"
                      : "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                    backdropFilter: "blur(10px)",
                    border: u.role === "admin"
                      ? "1px solid rgba(244, 67, 54, 0.3)"
                      : "1px solid rgba(102, 126, 234, 0.3)",
                    color: u.role === "admin" ? "#ffcdd2" : "#c7d2fe",
                    fontWeight: 500
                  }}>
                    {u.role || "user"}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: "0.9em", color: "#a1a1aa" }}>Created:</strong>
                  <div style={{ fontSize: "0.9em", color: "#71717a", marginTop: 4 }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </div>
                </div>
                {canDelete && (
                  <div style={{ marginTop: 8 }}>
                    <Button
                      onClick={() => handleDelete(u.id, u.username)}
                      disabled={deletingUserId === u.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        width: "100%",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseEnter={(e) => {
                        if (!deletingUserId) {
                          e.target.style.background = "rgba(239, 68, 68, 0.2)";
                          e.target.style.border = "1px solid rgba(239, 68, 68, 0.4)";
                          e.target.style.color = "#ffcdd2";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!deletingUserId) {
                          e.target.style.background = "rgba(255, 255, 255, 0.08)";
                          e.target.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                          e.target.style.color = "#ffffff";
                        }
                      }}
                    >
                      {deletingUserId === u.id ? "Deleting..." : "🗑️ Delete User"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop table view
  return (
    <div>
      <h4 style={{ fontSize: "1.2em", color: "#f4f4f5", fontWeight: 500, marginBottom: 16 }}>All Users ({users.length})</h4>
      <div style={{ 
        maxHeight: "400px", 
        overflowY: "auto", 
        overflowX: "auto",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <th style={{ padding: 12, textAlign: "left", color: "#a1a1aa", fontSize: "0.85em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Username</th>
              <th style={{ padding: 12, textAlign: "left", color: "#a1a1aa", fontSize: "0.85em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
              <th style={{ padding: 12, textAlign: "left", color: "#a1a1aa", fontSize: "0.85em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</th>
              <th style={{ padding: 12, textAlign: "left", color: "#a1a1aa", fontSize: "0.85em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Created</th>
              <th style={{ padding: 12, textAlign: "left", color: "#a1a1aa", fontSize: "0.85em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u && u.id).map((u) => {
              const canDelete = u.role !== "admin" && u.id !== currentUserId;
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: 12, color: "#f4f4f5" }}>{u.username || "-"}</td>
                  <td style={{ padding: 12, color: "#f4f4f5" }}>{u.email || "-"}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: 6, 
                      fontSize: "0.85em",
                      background: u.role === "admin" 
                        ? "linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(211, 47, 47, 0.2) 100%)"
                        : "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                      backdropFilter: "blur(10px)",
                      border: u.role === "admin"
                        ? "1px solid rgba(244, 67, 54, 0.3)"
                        : "1px solid rgba(102, 126, 234, 0.3)",
                      color: u.role === "admin" ? "#ffcdd2" : "#c7d2fe",
                      fontWeight: 500
                    }}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: "0.9em", color: "#71717a" }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </td>
                  <td style={{ padding: 12 }}>
                    {canDelete ? (
                      <Button
                        onClick={() => handleDelete(u.id, u.username)}
                        disabled={deletingUserId === u.id}
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#ffffff",
                          fontSize: "0.85em",
                          padding: "6px 12px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                          if (!deletingUserId) {
                            e.target.style.background = "rgba(239, 68, 68, 0.2)";
                            e.target.style.border = "1px solid rgba(239, 68, 68, 0.4)";
                            e.target.style.color = "#ffcdd2";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!deletingUserId) {
                            e.target.style.background = "rgba(255, 255, 255, 0.08)";
                            e.target.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                            e.target.style.color = "#ffffff";
                          }
                        }}
                      >
                        {deletingUserId === u.id ? "Deleting..." : "Delete"}
                      </Button>
                    ) : (
                      <span style={{ color: "#71717a", fontSize: "0.85em" }}>
                        {u.role === "admin" ? "Protected" : "Current user"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

