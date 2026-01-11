import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Input from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";
import Alert from "../common/Alert";
import SectionHeader from "../common/SectionHeader";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Form component for creating a new user with Horizon UI styling
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
    <Card 
      variant="glass"
      style={{ 
        marginBottom: isMobile ? spacing.xl : spacing['2xl'],
        borderRadius: borderRadius.xl,
      }}
    >
      <SectionHeader 
        title="Create New Customer"
        level={2}
      />
      <form onSubmit={onSubmit}>
        <div style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns: isMobile ? undefined : "1fr 1fr 1fr auto",
          gap: isMobile ? spacing.md : `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.sm}`,
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
            alignItems: isMobile ? "stretch" : "flex-start",
            justifyContent: isMobile ? "stretch" : "flex-start",
            paddingTop: isMobile ? 0 : `calc(${typography.fontSize.sm} + ${spacing.sm} + 2px)`,
            paddingLeft: isMobile ? 0 : spacing.sm,
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
      
      {createdUserCredentials && (
        <Alert variant="success" style={{ marginTop: spacing.lg }}>
          <strong style={{ fontSize: typography.fontSize.sm, display: "block", marginBottom: spacing.md }}>
            ✓ User Created Successfully!
          </strong>
          <div style={{ 
            marginTop: spacing.md, 
            fontFamily: "monospace", 
            fontSize: typography.fontSize.sm, 
            color: colors.text.primary,
          }}>
            <div style={{ marginBottom: spacing.xs }}>
              <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>Username:</strong> {createdUserCredentials.username}
            </div>
            <div style={{ marginBottom: spacing.xs }}>
              <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>Password:</strong> {createdUserCredentials.password}
            </div>
            {createdUserCredentials.email && (
              <div>
                <strong style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>Email:</strong> {createdUserCredentials.email}
              </div>
            )}
          </div>
          <div style={{ 
            marginTop: spacing.md, 
            fontSize: typography.fontSize.xs, 
            color: colors.text.primary,
            fontWeight: typography.fontWeight.semibold,
          }}>
            ⚠️ Save these credentials now - the password cannot be retrieved later!
          </div>
        </Alert>
      )}
      
      {error && (
        <Alert variant="error" style={{ marginTop: spacing.md }}>
          {error}
        </Alert>
      )}
    </Card>
  );
}
