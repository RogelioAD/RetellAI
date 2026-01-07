import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import { usePasswordChange } from "../hooks/usePasswordChange";
import { colors, spacing, typography } from "../constants/horizonTheme";

/**
 * Settings page with Horizon UI styling
 */
export default function Settings({ token }) {
  const { isMobile } = useResponsive();
  const passwordChange = usePasswordChange(token);

  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: spacing['2xl'],
          fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
          color: colors.text.primary,
          fontWeight: typography.fontWeight.bold,
        }}
      >
        Settings
      </h2>

      <div style={{ marginBottom: spacing['3xl'] }}>
        <h3
          style={{
            fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
            color: colors.text.primary,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing.lg,
          }}
        >
          Account Security
        </h3>
        <PasswordChangeForm
          passwordData={passwordChange.passwordData}
          onChange={passwordChange.handleChange}
          onSubmit={passwordChange.handleSubmit}
          onCancel={passwordChange.handleCancel}
          error={passwordChange.error}
          success={passwordChange.success}
          changing={passwordChange.changing}
        />
      </div>
    </div>
  );
}
