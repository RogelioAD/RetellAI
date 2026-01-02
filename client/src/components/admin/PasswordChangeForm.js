import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import Input from "../common/Input";
import Button from "../common/Button";
import { formStyles } from "../../constants/styles";

/**
 * Form component for changing password with responsive design
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
    <div style={{
      ...formStyles.container,
      ...(isMobile && formStyles.containerMobile)
    }}>
      <h3 style={{ 
        marginTop: 0,
        fontSize: isMobile ? "1.2em" : "1.3em"
      }}>Change Password</h3>
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
          <div style={{ color: "red", marginBottom: 12, fontSize: isMobile ? "14px" : "14px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: 12, fontSize: isMobile ? "14px" : "14px" }}>
            {success}
          </div>
        )}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: "8px" 
        }}>
          <Button 
            type="submit" 
            disabled={changing}
            fullWidth={isMobile}
          >
            {changing ? "Changing..." : "Change Password"}
          </Button>
          <Button 
            type="button" 
            onClick={onCancel} 
            disabled={changing}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

