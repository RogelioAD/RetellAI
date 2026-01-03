import React, { useState } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { usePasswordChange } from "../hooks/usePasswordChange";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import DashboardHeader from "../components/admin/DashboardHeader";
import UserManagement from "../components/admin/UserManagement";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import Button from "../components/common/Button";
import { refreshAgentNames } from "../services/api";
import { layoutStyles } from "../constants/styles";

/**
 * Main Dashboard page component with responsive design
 */
export default function Dashboard({ token, user, onLogout }) {
  const { isMobile } = useResponsive();
  const isAdmin = user?.role === "admin";
  const { calls, loading, error, refreshCalls } = useCalls(token, isAdmin);
  
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { users, loading: loadingUsers, error: userError, refreshUsers } = useUsers(
    token,
    isAdmin,
    showUserManagement
  );

  const passwordChange = usePasswordChange(token);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshAgentNames = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      await refreshAgentNames(token);
      // Refresh calls after updating agent names - wait for it to complete
      if (refreshCalls) {
        await refreshCalls();
      }
      alert("Agent names refreshed successfully!");
    } catch (err) {
      alert(`Failed to refresh agent names: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

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

      {isAdmin && (
        <div style={{ marginBottom: isMobile ? "12px" : "16px" }}>
          <Button
            onClick={handleRefreshAgentNames}
            disabled={refreshing || loading}
            style={{ fontSize: isMobile ? "14px" : "14px" }}
          >
            {refreshing ? "Refreshing..." : "🔄 Refresh Agent Names"}
          </Button>
        </div>
      )}
      {loading && <div style={{ padding: isMobile ? "16px 0" : "20px 0" }}>Loading...</div>}
      {error && <div style={{ color: "red", padding: isMobile ? "16px 0" : "20px 0" }}>{error}</div>}
      {!loading && !error && <CallList items={calls} groupByAgent={isAdmin} />}
    </div>
  );
}
