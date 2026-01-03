import React, { useState, useMemo } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { usePasswordChange } from "../hooks/usePasswordChange";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import DashboardHeader from "../components/admin/DashboardHeader";
import UserManagement from "../components/admin/UserManagement";
import PasswordChangeForm from "../components/admin/PasswordChangeForm";
import DateFilter, { getDateRange } from "../components/common/DateFilter";
import { extractCreatedAt } from "../utils/callDataTransformers";
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
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [customDate, setCustomDate] = useState(null);

  // Filter calls based on selected date range
  const filteredCalls = useMemo(() => {
    if (selectedDateRange === "all") {
      return calls;
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDate);
    
    if (!startDate && !endDate) {
      return calls;
    }

    return calls.filter((item) => {
      const mapping = item.mapping || {};
      const call = item.call || item;
      const callDate = new Date(extractCreatedAt(call, mapping));
      
      if (startDate && endDate) {
        return callDate >= startDate && callDate <= endDate;
      } else if (startDate) {
        return callDate >= startDate;
      } else if (endDate) {
        return callDate <= endDate;
      }
      
      return true;
    });
  }, [calls, selectedDateRange, customDate]);

  const handleDateRangeChange = (range, customDateValue) => {
    setSelectedDateRange(range);
    setCustomDate(customDateValue);
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

      {/* Date Filter */}
      <DateFilter
        onDateRangeChange={handleDateRangeChange}
        selectedRange={selectedDateRange}
      />

      {loading && (
        <div style={{ 
          padding: isMobile ? "32px 0" : "40px 0",
          textAlign: "center",
          color: "#71717a",
          fontSize: isMobile ? "15px" : "16px",
          fontWeight: 400
        }}>
          Loading...
        </div>
      )}
      {error && (
        <div style={{ 
          color: "#fca5a5", 
          padding: isMobile ? "20px" : "24px",
          background: "rgba(239, 68, 68, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: 12,
          border: "1px solid rgba(239, 68, 68, 0.2)",
          marginBottom: 20,
          fontSize: isMobile ? "14px" : "15px",
          fontWeight: 400
        }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <CallList items={filteredCalls} groupByAgent={isAdmin} />
      )}
    </div>
  );
}
