import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formatShortDate } from "../../utils/dateFormatters";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { colors, spacing, typography, tableStyles, borderRadius, glassStyles } from "../../constants/horizonTheme";

/**
 * Table component for displaying users with Horizon UI styling
 * Clean table design with proper spacing and visual hierarchy
 */
export default function UserTable({ users, loading, onDeleteUser, currentUserId }) {
  const { isMobile } = useResponsive();
  const [deletingUserId, setDeletingUserId] = useState(null);

  if (loading) {
    return (
      <EmptyState message="Loading users..." style={{ padding: isMobile ? spacing.lg : spacing.xl }} />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState message="No users found." />
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
        <SectionHeader 
          title={`All Users (${users.length})`}
          level={2}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          {users.filter(u => u && u.id).map((u) => {
            const canDelete = u.role !== "admin" && u.id !== currentUserId;
            return (
              <Card 
                key={u.id} 
                padding={spacing.lg}
                variant="glass"
                style={{ borderRadius: borderRadius.xl }}
              >
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                    Username:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.base, marginTop: spacing.xs, color: colors.text.primary, fontWeight: typography.fontWeight.semibold }}>
                    {u.username || "-"}
                  </div>
                </div>
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                    Email:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.base, marginTop: spacing.xs, color: colors.text.primary, fontWeight: typography.fontWeight.semibold }}>
                    {u.email || "-"}
                  </div>
                </div>
                <div style={{ marginBottom: spacing.md, display: "flex", alignItems: "center", gap: spacing.sm }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                    Role:
                  </strong>
                  <span style={{
                    display: "inline-block",
                    backgroundColor: 'rgba(66, 42, 251, 0.3)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(66, 42, 251, 0.4)',
                    borderRadius: borderRadius.md,
                    padding: `${spacing.xs} ${spacing.md}`,
                    boxShadow: '0 4px 16px 0 rgba(66, 42, 251, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
                    color: colors.text.white,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.xs,
                  }}>
                    {(u.role || "user").charAt(0).toUpperCase() + (u.role || "user").slice(1).toLowerCase()}
                  </span>
                </div>
                <div style={{ marginBottom: spacing.md }}>
                  <strong style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                    Created:
                  </strong>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, fontWeight: typography.fontWeight.medium, marginTop: spacing.xs }}>
                    {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                  </div>
                </div>
                {canDelete && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u.id, u.username);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      cursor: deletingUserId === u.id ? "not-allowed" : "pointer",
                      opacity: deletingUserId === u.id ? 0.6 : 1,
                      backgroundColor: 'rgba(227, 26, 26, 0.3)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(227, 26, 26, 0.4)',
                      borderRadius: borderRadius.md,
                      padding: `${spacing.md} ${spacing.lg}`,
                      boxShadow: '0 4px 16px 0 rgba(227, 26, 26, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
                      color: colors.text.white,
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.sm,
                      transition: 'all 0.2s ease',
                      position: "relative",
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      if (deletingUserId !== u.id) {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(227, 26, 26, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(227, 26, 26, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    {deletingUserId === u.id ? "Deleting..." : "Delete"}
                  </span>
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
      <SectionHeader 
        title={`All Users (${users.length})`}
        level={2}
      />
      <Card 
        variant="glass"
        style={{ overflow: "hidden", borderRadius: borderRadius.xl }}
      >
        <div style={{ 
          maxHeight: "500px", 
          overflowY: "auto", 
          overflowX: "auto",
        }}>
          <div style={{
            backgroundColor: glassStyles.frosty.backgroundColor,
            backdropFilter: glassStyles.frosty.backdropFilter,
            WebkitBackdropFilter: glassStyles.frosty.WebkitBackdropFilter,
            borderRadius: borderRadius.xl,
            borderTop: glassStyles.frosty.border,
            borderLeft: glassStyles.frosty.border,
            borderRight: glassStyles.frosty.border,
            borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
            marginBottom: spacing.xs,
            padding: 0,
            boxShadow: 'none',
            overflow: 'hidden',
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead>
                <tr>
                  <th style={{ 
                    ...tableStyles.header,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    paddingRight: spacing.lg,
                    color: colors.text.primary,
                  }}>
                    Username
                  </th>
                  <th style={{ 
                    ...tableStyles.header,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    paddingRight: spacing.lg,
                    color: colors.text.primary,
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    ...tableStyles.header,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    paddingRight: spacing.lg,
                    color: colors.text.primary,
                  }}>
                    Role
                  </th>
                  <th style={{ 
                    ...tableStyles.header,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    paddingRight: spacing.lg,
                    color: colors.text.primary,
                  }}>
                    Created
                  </th>
                  <th style={{ 
                    ...tableStyles.header,
                    textAlign: "left",
                    backgroundColor: "transparent",
                    border: "none",
                    color: colors.text.primary,
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead style={{ display: "none" }}>
              <tr></tr>
            </thead>
            <tbody>
              {users.filter(u => u && u.id).map((u) => {
                const canDelete = u.role !== "admin" && u.id !== currentUserId;
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid rgba(255, 255, 255, 0.1)` }}>
                    <td style={{ ...tableStyles.cell, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                      {u.username || "-"}
                    </td>
                    <td style={{ ...tableStyles.cell, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                      {u.email || "-"}
                    </td>
                    <td style={{ ...tableStyles.cell }}>
                      <span style={{
                        display: "inline-block",
                        backgroundColor: 'rgba(66, 42, 251, 0.3)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                        border: '1px solid rgba(66, 42, 251, 0.4)',
                        borderRadius: borderRadius.md,
                        padding: `${spacing.xs} ${spacing.md}`,
                        boxShadow: '0 4px 16px 0 rgba(66, 42, 251, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
                        color: colors.text.white,
                        fontWeight: typography.fontWeight.bold,
                        fontSize: typography.fontSize.xs,
                      }}>
                        {(u.role || "user").charAt(0).toUpperCase() + (u.role || "user").slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ ...tableStyles.cell, color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
                      {u.createdAt ? formatShortDate(u.createdAt) : "-"}
                    </td>
                    <td style={{ ...tableStyles.cell }}>
                      {canDelete ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u.id, u.username);
                          }}
                          style={{
                            display: "inline-block",
                            cursor: deletingUserId === u.id ? "not-allowed" : "pointer",
                            opacity: deletingUserId === u.id ? 0.6 : 1,
                            backgroundColor: 'rgba(227, 26, 26, 0.3)',
                            backdropFilter: 'blur(40px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                            border: '1px solid rgba(227, 26, 26, 0.4)',
                            borderRadius: borderRadius.md,
                            padding: `${spacing.xs} ${spacing.md}`,
                            boxShadow: '0 4px 16px 0 rgba(227, 26, 26, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
                            color: colors.text.white,
                            fontWeight: typography.fontWeight.bold,
                            fontSize: typography.fontSize.xs,
                            transition: 'all 0.2s ease',
                            position: "relative",
                            zIndex: 1,
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            if (deletingUserId !== u.id) {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(227, 26, 26, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(227, 26, 26, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
                          }}
                        >
                          {deletingUserId === u.id ? "Deleting..." : "Delete"}
                        </span>
                      ) : (
                        <span style={{ color: colors.text.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium }}>
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
