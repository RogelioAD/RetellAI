import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Input from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";
import Alert from "../common/Alert";
import SectionHeader from "../common/SectionHeader";
import { spacing, borderRadius } from "../../constants/horizonTheme";

/**
 * Form component for changing password with Horizon UI styling
 */
export default function PasswordChangeForm({
  passwordData,
  onChange,
  onSubmit,
  onCancel,
  error,
  success,
  changing
}) {
  const { isMobile } = useResponsive();

  return (
    <Card 
      variant="glass"
      style={{ borderRadius: borderRadius.xl }}
    >
      <SectionHeader 
        title="Change Password"
        level={2}
      />
      <form onSubmit={onSubmit}>
        <Input
          label="Current Password"
          type="password"
          value={passwordData.currentPassword}
          onChange={(e) => onChange("currentPassword", e.target.value)}
          required
          disabled={changing}
        />
        <Input
          label="New Password"
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => onChange("newPassword", e.target.value)}
          required
          disabled={changing}
          minLength={6}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          required
          disabled={changing}
          minLength={6}
        />
        {error && (
          <Alert variant="error" style={{ marginBottom: spacing.md }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" style={{ marginBottom: spacing.md }}>
            {success}
          </Alert>
        )}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: spacing.md,
        }}>
          <Button 
            type="submit" 
            disabled={changing}
            variant="primary"
            fullWidth={isMobile}
          >
            {changing ? "Changing..." : "Change Password"}
          </Button>
          <Button 
            type="button" 
            onClick={onCancel} 
            disabled={changing}
            variant="primary"
            fullWidth={isMobile}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
