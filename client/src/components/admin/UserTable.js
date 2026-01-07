import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formatShortDate } from "../../utils/dateFormatters";
import Button from "../common/Button";
import Card from "../common/Card";
import { colors, spacing, typography, tableStyles, borderRadius } from "../../constants/horizonTheme";

/**
 * Table component for displaying users with Horizon UI styling
 * Clean table design with proper spacing and visual hierarchy
 */
export default function UserTable({ users, loading, onDeleteUser, currentUserId }) {
  const { isMobile } = useResponsive();
  const [deletingUserId, setDeletingUserId] = useState(null);

  if (loading) {
    return (
      <div style={{ 
        padding: isMobile ? spacing.lg : spacing.xl, 
        color: colors.text.secondary,
        textAlign: "center",
      }}>
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ 
        padding: isMobile ? spacing.lg : spacing.xl, 
        color: colors.text.secondary,
        textAlign: "center",
      }}>
        No users found.
      </div>
    );
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
        <h4 style={{ 
          fontSize: typography.fontSize.lg, 
          marginBottom: spacing.lg, 
          color: colors.text.primary, 
          fontWeight: typography.fontWeight.semibold,
        }}>
          All Users ({users.length})
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          {users.filter(u => u && u.id).map((u) => {
            const canDelete = u.role !== "admin" && u.id !== currentUserId;
            return (
              <Card key={u.id} padding={spacing.lg}>
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Username:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.base, marginTop: spacing.xs, color: colors.text.primary }}>
                    {u.username || "-"}
                  </div>
                </div>
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Email:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.base, marginTop: spacing.xs, color: colors.text.primary }}>
                    {u.email || "-"}
                  </div>
                </div>
                <div style={{ marginBottom: spacing.md, display: "flex", alignItems: "center", gap: spacing.sm }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Role:
                  </strong>
                  <span style={{ 
                    padding: `${spacing.xs} ${spacing.md}`, 
                    borderRadius: borderRadius.sm, 
                    fontSize: typography.fontSize.xs,
                    background: u.role === "admin" ? `${colors.error}15` : `${colors.brand[500]}15`,
                    color: u.role === "admin" ? colors.error : colors.brand[500],
                    fontWeight: typography.fontWeight.semibold,
                    border: `1px solid ${u.role === "admin" ? colors.error : colors.brand[500]}`,
                  }}>
                    {u.role || "user"}
                  </span>
                </div>
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Created:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary, marginTop: spacing.xs }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </div>
                </div>
                {canDelete && (
                  <Button
                    onClick={() => handleDelete(u.id, u.username)}
                    disabled={deletingUserId === u.id}
                    variant="outline"
                    fullWidth
                    style={{
                      color: colors.error,
                      borderColor: colors.error,
                    }}
                  >
                    {deletingUserId === u.id ? "Deleting..." : "🗑️ Delete User"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop table view
  return (
    <div>
      <h4 style={{ 
        fontSize: typography.fontSize.xl, 
        color: colors.text.primary, 
        fontWeight: typography.fontWeight.semibold, 
        marginBottom: spacing.lg,
      }}>
        All Users ({users.length})
      </h4>
      <Card padding="0" style={{ overflow: "hidden" }}>
        <div style={{ 
          maxHeight: "500px", 
          overflowY: "auto", 
          overflowX: "auto",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ 
                background: colors.gray[50], 
                borderBottom: `1px solid ${colors.gray[100]}`,
              }}>
                <th style={{ 
                  ...tableStyles.header,
                  textAlign: "left",
                }}>
                  Username
                </th>
                <th style={{ 
                  ...tableStyles.header,
                  textAlign: "left",
                }}>
                  Email
                </th>
                <th style={{ 
                  ...tableStyles.header,
                  textAlign: "left",
                }}>
                  Role
                </th>
                <th style={{ 
                  ...tableStyles.header,
                  textAlign: "left",
                }}>
                  Created
                </th>
                <th style={{ 
                  ...tableStyles.header,
                  textAlign: "left",
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u && u.id).map((u) => {
                const canDelete = u.role !== "admin" && u.id !== currentUserId;
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                    <td style={{ ...tableStyles.cell }}>
                      {u.username || "-"}
                    </td>
                    <td style={{ ...tableStyles.cell }}>
                      {u.email || "-"}
                    </td>
                    <td style={{ ...tableStyles.cell }}>
                      <span style={{ 
                        padding: `${spacing.xs} ${spacing.md}`, 
                        borderRadius: borderRadius.sm, 
                        fontSize: typography.fontSize.xs,
                        background: u.role === "admin" ? `${colors.error}15` : `${colors.brand[500]}15`,
                        color: u.role === "admin" ? colors.error : colors.brand[500],
                        fontWeight: typography.fontWeight.semibold,
                        border: `1px solid ${u.role === "admin" ? colors.error : colors.brand[500]}`,
                      }}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td style={{ ...tableStyles.cell, color: colors.text.secondary }}>
                      {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                    </td>
                    <td style={{ ...tableStyles.cell }}>
                      {canDelete ? (
                        <Button
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={deletingUserId === u.id}
                          variant="outline"
                          style={{
                            fontSize: typography.fontSize.xs,
                            padding: `${spacing.xs} ${spacing.md}`,
                            color: colors.error,
                            borderColor: colors.error,
                          }}
                        >
                          {deletingUserId === u.id ? "Deleting..." : "Delete"}
                        </Button>
                      ) : (
                        <span style={{ color: colors.text.tertiary, fontSize: typography.fontSize.xs }}>
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
      </Card>
    </div>
  );
}
