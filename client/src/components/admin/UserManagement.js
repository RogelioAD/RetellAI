import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { createCustomer } from "../../services/api";
import { validateUserCreation } from "../../utils/validators";
import CreateUserForm from "./CreateUserForm";
import UserTable from "./UserTable";
import SectionHeader from "../common/SectionHeader";
import { colors, spacing, typography, borderRadius, glassStyles } from "../../constants/horizonTheme";

// User management component with tabbed interface for creating and viewing users
export default function UserManagement({ token, users, loading, error, onUserCreated, currentUserId }) {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState("create");
  const [newUser, setNewUser] = useState({ username: "", password: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [userError, setUserError] = useState(null);
  const [createdUserCredentials, setCreatedUserCredentials] = useState(null);

  // Updates form field value and clears errors
  const handleChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
    setUserError(null);
  };

  // Handles user creation form submission with validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserError(null);
    setCreatedUserCredentials(null);

    const validationError = validateUserCreation(
      newUser.username,
      newUser.password,
      newUser.email
    );

    if (validationError) {
      setUserError(validationError);
      return;
    }

    setCreating(true);
    try {
      const result = await createCustomer(token, newUser);
      setCreatedUserCredentials({
        username: result.user.username,
        password: result.password,
        email: result.user.email
      });
      setNewUser({ username: "", password: "", email: "" });
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      setUserError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <SectionHeader 
        title="User Management"
        level={1}
      />
      
      <div style={{
        display: "flex",
        gap: spacing.md,
        marginBottom: spacing.xl,
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}>
        <button
          onClick={() => setActiveTab("create")}
          style={{
            ...glassStyles.base,
            ...(activeTab === "create" ? {
              backgroundColor: glassStyles.active.backgroundColor,
              border: glassStyles.active.border,
            } : {}),
            borderRadius: borderRadius.lg,
            padding: `${spacing.md} ${spacing.xl}`,
            fontSize: typography.fontSize.sm,
            fontWeight: activeTab === "create" ? typography.fontWeight.bold : typography.fontWeight.semibold,
            color: colors.text.primary,
            cursor: "pointer",
            outline: "none",
            flex: isMobile ? "1 1 100%" : "0 1 auto",
            minWidth: isMobile ? "auto" : "180px",
            transition: "all 0.3s ease",
            transform: activeTab === "create" ? "scale(1.02)" : "scale(1)",
            boxShadow: activeTab === "create" 
              ? "0 8px 32px 0 rgba(66, 42, 251, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)"
              : glassStyles.base.boxShadow,
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "create") {
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "create") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = glassStyles.base.boxShadow;
            }
          }}
        >
          Create New Customer
        </button>
        
        <button
          onClick={() => setActiveTab("users")}
          style={{
            ...glassStyles.base,
            ...(activeTab === "users" ? {
              backgroundColor: glassStyles.active.backgroundColor,
              border: glassStyles.active.border,
            } : {}),
            borderRadius: borderRadius.lg,
            padding: `${spacing.md} ${spacing.xl}`,
            fontSize: typography.fontSize.sm,
            fontWeight: activeTab === "users" ? typography.fontWeight.bold : typography.fontWeight.semibold,
            color: colors.text.primary,
            cursor: "pointer",
            outline: "none",
            flex: isMobile ? "1 1 100%" : "0 1 auto",
            minWidth: isMobile ? "auto" : "180px",
            transition: "all 0.3s ease",
            transform: activeTab === "users" ? "scale(1.02)" : "scale(1)",
            boxShadow: activeTab === "users" 
              ? "0 8px 32px 0 rgba(66, 42, 251, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)"
              : glassStyles.base.boxShadow,
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "users") {
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "users") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = glassStyles.base.boxShadow;
            }
          }}
        >
          All Users
        </button>
      </div>

      {activeTab === "create" && (
        <CreateUserForm
          newUser={newUser}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={userError || error}
          creating={creating}
          createdUserCredentials={createdUserCredentials}
        />
      )}

      {activeTab === "users" && (
        <UserTable 
          users={users} 
          loading={loading} 
          onDeleteUser={async (userId) => {
            const { deleteUser } = await import("../../services/api");
            await deleteUser(token, userId);
            if (onUserCreated) {
              onUserCreated();
            }
          }}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
