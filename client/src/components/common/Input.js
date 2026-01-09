import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { inputStyles, colors, typography, spacing, borderRadius } from "../../constants/horizonTheme";

/**
 * Reusable input component with label, error state, and focus styles.
 */
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
  const { isMobile } = useResponsive();
  const [isFocused, setIsFocused] = React.useState(false);

  const inputStyle = {
    ...inputStyles.base,
    ...(isFocused && inputStyles.focus),
    ...(error && {
      borderColor: colors.error,
      boxShadow: `0 0 0 2px rgba(227, 26, 26, 0.1)`,
    }),
    outline: 'none',
    outlineWidth: 0,
    borderWidth: '1px',
    ...props.style,
  };

  return (
    <div style={{ marginBottom: isMobile ? spacing.lg : spacing.md }}>
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
          {label} {required && <span style={{ color: colors.error }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        {...props}
      />
      {error && (
        <div
          style={{
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
            padding: spacing.sm,
            backgroundColor: "rgba(227, 26, 26, 0.08)",
            border: `1px solid rgba(227, 26, 26, 0.2)`,
            borderRadius: borderRadius.md,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
