import React from "react";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import { usePasswordChange } from "../hooks/usePasswordChange";
import SectionHeader from "../components/common/SectionHeader";
import { spacing } from "../constants/horizonTheme";

// Settings page component that renders password change functionality
export default function Settings({ token }) {
  const passwordChange = usePasswordChange(token);

  return (
    <div>
      <SectionHeader 
        title="Settings"
        level={1}
      />

      <div style={{ marginBottom: spacing['3xl'] }}>
        <SectionHeader 
          title="Account Security"
          level={2}
        />
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
