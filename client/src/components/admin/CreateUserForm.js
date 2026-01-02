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
      padding: isMobile ? 12 : 15, 
      backgroundColor: "#fff", 
      borderRadius: 4 
    }}>
      <h4 style={{ fontSize: isMobile ? "1.1em" : "1.2em", marginTop: 0 }}>Create New Customer</h4>
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
          padding: 12, 
          backgroundColor: "#e8f5e9", 
          border: "2px solid #4caf50", 
          borderRadius: 4,
          marginTop: 12
        }}>
          <strong style={{ color: "#2e7d32" }}>✓ User Created Successfully!</strong>
          <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: "0.9em" }}>
            <div><strong>Username:</strong> {createdUserCredentials.username}</div>
            <div><strong>Password:</strong> {createdUserCredentials.password}</div>
            {createdUserCredentials.email && (
              <div><strong>Email:</strong> {createdUserCredentials.email}</div>
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: "0.85em", color: "#666" }}>
            ⚠️ Save these credentials now - the password cannot be retrieved later!
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ color: "red", marginTop: 12, fontSize: "0.9em" }}>{error}</div>
      )}
    </div>
  );
}

