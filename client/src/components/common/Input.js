import React from "react";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

// Reusable input component with label, error state, and Horizon UI styling
export default function Input({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  error = null,
  ...props
}) {
  return (
    <div style={{ marginBottom: spacing.lg, width: "100%" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: spacing.sm,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
          }}
        >
          {label}
          {required && (
            <span style={{ color: colors.error[500], marginLeft: spacing.xs }}>
              *
            </span>
          )}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: spacing.md,
          border: `1px solid ${error ? colors.error[500] : colors.gray[300]}`,
          borderRadius: borderRadius.md,
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.primary,
          backgroundColor: disabled ? colors.gray[100] : colors.white,
          opacity: disabled ? 0.6 : 1,
        }}
        {...props}
      />
      {error && (
        <div
          style={{
            marginTop: spacing.xs,
            fontSize: typography.fontSize.sm,
            color: colors.error[500],
            fontWeight: typography.fontWeight.medium,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
