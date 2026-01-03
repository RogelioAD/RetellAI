import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { gridStyles } from "../../constants/styles";
import Input from "../common/Input";
import Button from "../common/Button";

/**
 * Form component for creating a new user with responsive design
 */
export default function CreateUserForm({
  newUser,
  onChange,
  onSubmit,
  error,
  creating,
  createdUserCredentials
}) {
  const { isMobile } = useResponsive();

  return (
    <div style={{ 
      marginBottom: isMobile ? 20 : 30, 
      padding: isMobile ? 16 : 20, 
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset"
    }}>
      <h4 style={{ 
        fontSize: isMobile ? "1.1em" : "1.2em", 
        marginTop: 0,
        color: "#f4f4f5",
        fontWeight: 500
      }}>Create New Customer</h4>
      <form onSubmit={onSubmit}>
        <div style={{
          ...(isMobile ? gridStyles.createUserFormMobile : gridStyles.createUserForm),
          marginBottom: 12
        }}>
          <div>
            <Input
              label="Username"
              value={newUser.username}
              onChange={(e) => onChange("username", e.target.value)}
              required
              disabled={creating}
              placeholder="Enter username"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => onChange("password", e.target.value)}
              required
              disabled={creating}
              minLength={6}
              placeholder="Min 6 characters"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <Input
              label="Email (optional)"
              type="email"
              value={newUser.email}
              onChange={(e) => onChange("email", e.target.value)}
              disabled={creating}
              placeholder="user@example.com"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: isMobile ? "stretch" : "flex-end" 
          }}>
            <Button 
              type="submit" 
              disabled={creating}
              fullWidth={isMobile}
              style={{ 
                padding: isMobile ? "12px 16px" : "8px 16px", 
                height: isMobile ? "auto" : "fit-content" 
              }}
            >
              {creating ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Show created user credentials */}
      {createdUserCredentials && (
        <div style={{ 
          padding: 16, 
          background: "rgba(76, 175, 80, 0.1)", 
          border: "1px solid rgba(76, 175, 80, 0.3)", 
          borderRadius: 10,
          marginTop: 16,
          backdropFilter: "blur(10px)"
        }}>
          <strong style={{ color: "#81c784", fontSize: "0.95em" }}>✓ User Created Successfully!</strong>
          <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: "0.9em", color: "#d4d4d8" }}>
            <div style={{ marginBottom: 6 }}><strong style={{ color: "#a1a1aa" }}>Username:</strong> {createdUserCredentials.username}</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: "#a1a1aa" }}>Password:</strong> {createdUserCredentials.password}</div>
            {createdUserCredentials.email && (
              <div><strong style={{ color: "#a1a1aa" }}>Email:</strong> {createdUserCredentials.email}</div>
            )}
          </div>
          <div style={{ marginTop: 10, fontSize: "0.85em", color: "#71717a" }}>
            ⚠️ Save these credentials now - the password cannot be retrieved later!
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: "#fca5a5", 
          marginTop: 12, 
          fontSize: "0.9em",
          padding: "12px",
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: 8
        }}>{error}</div>
      )}
    </div>
  );
}

