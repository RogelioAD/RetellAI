import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { formStyles } from "../../constants/styles";

/**
 * Reusable Input component with responsive design
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

  return (
    <div style={{ marginBottom: isMobile ? 16 : 12 }}>
      {label && (
        <label style={{ 
          ...formStyles.label,
          fontSize: isMobile ? "16px" : "14px",
          color: "#a1a1aa"
        }}>
          {label} {required && <span style={{ color: "#fca5a5" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          ...formStyles.input,
          ...(isMobile && formStyles.inputMobile),
          ...props.style
        }}
        {...props}
      />
      {error && (
        <div style={{ 
          color: "#fca5a5", 
          fontSize: isMobile ? "14px" : "0.9em", 
          marginTop: 4,
          padding: "8px",
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: 6
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

