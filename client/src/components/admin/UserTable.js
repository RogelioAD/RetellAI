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
    return <div style={{ padding: isMobile ? "16px" : "20px" }}>Loading users...</div>;
  }

  if (users.length === 0) {
    return <div style={{ padding: isMobile ? "16px" : "20px" }}>No users found.</div>;
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
        <h4 style={{ fontSize: "1.1em", marginBottom: 12 }}>All Users ({users.length})</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {users.filter(u => u && u.id).map((u) => {
            const canDelete = u.role !== "admin" && u.id !== currentUserId;
            return (
              <div
                key={u.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 12
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: "0.9em", color: "#666" }}>Username:</strong>
                  <div style={{ fontSize: "1em", marginTop: 4 }}>{u.username || "-"}</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: "0.9em", color: "#666" }}>Email:</strong>
                  <div style={{ fontSize: "1em", marginTop: 4 }}>{u.email || "-"}</div>
                </div>
                <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "0.9em", color: "#666" }}>Role:</strong>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    fontSize: "0.85em",
                    backgroundColor: u.role === "admin" ? "#ffebee" : "#e3f2fd",
                    color: u.role === "admin" ? "#c62828" : "#1565c0"
                  }}>
                    {u.role || "user"}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: "0.9em", color: "#666" }}>Created:</strong>
                  <div style={{ fontSize: "0.9em", color: "#666", marginTop: 4 }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </div>
                </div>
                {canDelete && (
                  <div style={{ marginTop: 8 }}>
                    <Button
                      onClick={() => handleDelete(u.id, u.username)}
                      disabled={deletingUserId === u.id}
                      style={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        width: "100%"
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
      <h4 style={{ fontSize: "1.2em" }}>All Users ({users.length})</h4>
      <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", minWidth: "700px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Username</th>
              <th style={{ padding: 10, textAlign: "left" }}>Email</th>
              <th style={{ padding: 10, textAlign: "left" }}>Role</th>
              <th style={{ padding: 10, textAlign: "left" }}>Created</th>
              <th style={{ padding: 10, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u && u.id).map((u) => {
              const canDelete = u.role !== "admin" && u.id !== currentUserId;
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>{u.username || "-"}</td>
                  <td style={{ padding: 10 }}>{u.email || "-"}</td>
                  <td style={{ padding: 10 }}>
                    <span style={{ 
                      padding: "2px 8px", 
                      borderRadius: 4, 
                      fontSize: "0.85em",
                      backgroundColor: u.role === "admin" ? "#ffebee" : "#e3f2fd",
                      color: u.role === "admin" ? "#c62828" : "#1565c0"
                    }}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td style={{ padding: 10, fontSize: "0.9em", color: "#666" }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </td>
                  <td style={{ padding: 10 }}>
                    {canDelete ? (
                      <Button
                        onClick={() => handleDelete(u.id, u.username)}
                        disabled={deletingUserId === u.id}
                        style={{
                          backgroundColor: "#f44336",
                          color: "#fff",
                          border: "none",
                          fontSize: "0.85em",
                          padding: "4px 8px"
                        }}
                      >
                        {deletingUserId === u.id ? "Deleting..." : "Delete"}
                      </Button>
                    ) : (
                      <span style={{ color: "#999", fontSize: "0.85em" }}>
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

