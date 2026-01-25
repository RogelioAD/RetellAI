import React from "react";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import { usePasswordChange } from "../hooks/usePasswordChange";
import SectionHeader from "../components/common/SectionHeader";
import { colors, spacing, typography } from "../constants/horizonTheme";

// Settings page component that renders password change functionality
export default function Settings({ token }) {
  const passwordChange = usePasswordChange(token);

  return (
    <div>
      <div style={{ marginBottom: spacing["2xl"] }}>
        <SectionHeader title="Settings" level={1} style={{ marginBottom: 0 }} />
        <p
          style={{
            margin: 0,
            marginTop: spacing.xs,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontWeight: typography.fontWeight.medium,
          }}
        >
          Manage your account and security.
        </p>
      </div>

      <div style={{ marginTop: spacing["3xl"] }}>
        <SectionHeader title="Account Security" level={2} />
        <div style={{ marginTop: spacing.xl }}>
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
    </div>
  );
}
