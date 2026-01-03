import React, { useState } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { usePasswordChange } from "../hooks/usePasswordChange";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import DashboardHeader from "../components/admin/DashboardHeader";
import UserManagement from "../components/admin/UserManagement";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import { layoutStyles } from "../constants/styles";

/**
 * Main Dashboard page component with responsive design
 */
export default function Dashboard({ token, user, onLogout }) {
  const { isMobile } = useResponsive();
  const isAdmin = user?.role === "admin";
  const { calls, loading, error } = useCalls(token, isAdmin);
  
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { users, loading: loadingUsers, error: userError, refreshUsers } = useUsers(
    token,
    isAdmin,
    showUserManagement
  );

  const passwordChange = usePasswordChange(token);

  return (
    <div style={{
      ...layoutStyles.dashboard,
      ...(isMobile && layoutStyles.dashboardMobile)
    }}>
      <DashboardHeader
        user={user}
        isAdmin={isAdmin}
        onLogout={onLogout}
        onToggleUserManagement={() => setShowUserManagement(!showUserManagement)}
        showUserManagement={showUserManagement}
        onTogglePasswordChange={() => passwordChange.setShowForm(!passwordChange.showForm)}
        showPasswordChange={passwordChange.showForm}
      />

      {/* User Management for Admins */}
      {isAdmin && showUserManagement && (
        <UserManagement
          token={token}
          users={users}
          loading={loadingUsers}
          error={userError}
          onUserCreated={refreshUsers}
          currentUserId={user?.id}
        />
      )}

      {/* Password Change Form for Clients */}
      {!isAdmin && passwordChange.showForm && (
        <PasswordChangeForm
          passwordData={passwordChange.passwordData}
          onChange={passwordChange.handleChange}
          onSubmit={passwordChange.handleSubmit}
          onCancel={passwordChange.handleCancel}
          error={passwordChange.error}
          success={passwordChange.success}
          changing={passwordChange.changing}
        />
      )}

      {loading && <div style={{ padding: isMobile ? "16px 0" : "20px 0" }}>Loading...</div>}
      {error && <div style={{ color: "red", padding: isMobile ? "16px 0" : "20px 0" }}>{error}</div>}
      {!loading && !error && <CallList items={calls} groupByAgent={isAdmin} />}
    </div>
  );
}
