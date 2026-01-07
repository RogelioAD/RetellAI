import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Input from "../common/Input";
import Button from "../common/Button";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

/**
 * Form component for creating a new user with Horizon UI styling
 */
export default function CreateUserForm({
  newUser,
  onChange,
  onSubmit,
  error,
  creating,
  createdUserCredentials
}) {
  const { isMobile } = useResponsive();

  return (
    <div style={{ 
      marginBottom: isMobile ? spacing.xl : spacing['2xl'], 
      padding: isMobile ? spacing.lg : spacing.xl, 
      background: colors.gray[50],
      border: `1px solid ${colors.gray[100]}`,
      borderRadius: borderRadius.lg,
    }}>
      <h4 style={{ 
        fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl, 
        marginTop: 0,
        marginBottom: spacing.lg,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.semibold,
      }}>
        Create New Customer
      </h4>
      <form onSubmit={onSubmit}>
        <div style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns: isMobile ? undefined : "1fr 1fr 1fr auto",
          gap: spacing.md,
          marginBottom: spacing.md,
        }}>
          <div>
            <Input
              label="Username"
              value={newUser.username}
              onChange={(e) => onChange("username", e.target.value)}
              required
              disabled={creating}
              placeholder="Enter username"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => onChange("password", e.target.value)}
              required
              disabled={creating}
              minLength={6}
              placeholder="Min 6 characters"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <Input
              label="Email (optional)"
              type="email"
              value={newUser.email}
              onChange={(e) => onChange("email", e.target.value)}
              disabled={creating}
              placeholder="user@example.com"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: isMobile ? "stretch" : "flex-end",
            justifyContent: isMobile ? "stretch" : "flex-start",
          }}>
            <Button 
              type="submit" 
              disabled={creating}
              variant="primary"
              fullWidth={isMobile}
              style={{ 
                minHeight: "44px",
              }}
            >
              {creating ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Show created user credentials */}
      {createdUserCredentials && (
        <div style={{ 
          padding: spacing.lg, 
          background: `${colors.success}08`, 
          border: `1px solid ${colors.success}`, 
          borderRadius: borderRadius.md,
          marginTop: spacing.lg,
        }}>
          <strong style={{ color: colors.success, fontSize: typography.fontSize.sm }}>
            ✓ User Created Successfully!
          </strong>
          <div style={{ 
            marginTop: spacing.md, 
            fontFamily: "monospace", 
            fontSize: typography.fontSize.sm, 
            color: colors.text.primary,
          }}>
            <div style={{ marginBottom: spacing.xs }}>
              <strong style={{ color: colors.text.secondary }}>Username:</strong> {createdUserCredentials.username}
            </div>
            <div style={{ marginBottom: spacing.xs }}>
              <strong style={{ color: colors.text.secondary }}>Password:</strong> {createdUserCredentials.password}
            </div>
            {createdUserCredentials.email && (
              <div>
                <strong style={{ color: colors.text.secondary }}>Email:</strong> {createdUserCredentials.email}
              </div>
            )}
          </div>
          <div style={{ 
            marginTop: spacing.md, 
            fontSize: typography.fontSize.xs, 
            color: colors.text.secondary,
          }}>
            ⚠️ Save these credentials now - the password cannot be retrieved later!
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: colors.error, 
          marginTop: spacing.md, 
          fontSize: typography.fontSize.sm,
          padding: spacing.md,
          background: `${colors.error}08`,
          border: `1px solid ${colors.error}`,
          borderRadius: borderRadius.sm,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
