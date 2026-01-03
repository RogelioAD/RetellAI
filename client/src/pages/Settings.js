import React from "react";
import { useResponsive } from "../hooks/useResponsive";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import { usePasswordChange } from "../hooks/usePasswordChange";

/**
 * Settings page component
 */
export default function Settings({ token }) {
  const { isMobile } = useResponsive();
  const passwordChange = usePasswordChange(token);

  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
          fontSize: isMobile ? "1.5em" : "1.75em",
          color: "#f4f4f5",
          fontWeight: 600,
        }}
      >
        Settings
      </h2>

      <div style={{ marginBottom: 32 }}>
        <h3
          style={{
            fontSize: isMobile ? "1.1em" : "1.2em",
            color: "#f4f4f5",
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          Account
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

