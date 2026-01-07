import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Input from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";
import { colors, spacing, typography } from "../../constants/horizonTheme";

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
    <Card>
      <h3 style={{ 
        marginTop: 0,
        marginBottom: spacing.xl,
        fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
        color: colors.text.primary,
        fontWeight: typography.fontWeight.semibold,
      }}>
        Change Password
      </h3>
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
          <div style={{ 
            color: colors.error, 
            marginBottom: spacing.md, 
            fontSize: typography.fontSize.sm,
            padding: spacing.md,
            backgroundColor: `${colors.error}08`,
            border: `1px solid ${colors.error}`,
            borderRadius: "8px",
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            color: colors.success, 
            marginBottom: spacing.md, 
            fontSize: typography.fontSize.sm,
            padding: spacing.md,
            backgroundColor: `${colors.success}08`,
            border: `1px solid ${colors.success}`,
            borderRadius: "8px",
          }}>
            {success}
          </div>
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
            variant="outline"
            fullWidth={isMobile}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
