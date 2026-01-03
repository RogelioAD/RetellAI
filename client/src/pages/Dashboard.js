import React, { useState, useMemo } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import UserManagement from "../components/admin/UserManagement";
import Settings from "./Settings";
import Navigation from "../components/layout/Navigation";
import AppHeader from "../components/layout/AppHeader";
import QuickStats from "../components/layout/QuickStats";
import DateFilter, { getDateRange } from "../components/common/DateFilter";
import { extractCreatedAt } from "../utils/callDataTransformers";

/**
 * Main Dashboard page component with responsive design and navigation
 */
export default function Dashboard({ token, user, onLogout }) {
  const { isMobile } = useResponsive();
  const isAdmin = user?.role === "admin";
  const { calls, loading, error } = useCalls(token, isAdmin);
  
  const [currentSection, setCurrentSection] = useState("calls");
  const { users, loading: loadingUsers, error: userError, refreshUsers } = useUsers(
    token,
    isAdmin,
    currentSection === "users"
  );

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

  // Render content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case "users":
        if (!isAdmin) return null;
        return (
          <UserManagement
            token={token}
            users={users}
            loading={loadingUsers}
            error={userError}
            onUserCreated={refreshUsers}
            currentUserId={user?.id}
          />
        );

      case "settings":
        return <Settings token={token} />;

      case "calls":
      default:
        return (
          <>
            {/* Quick Stats */}
            {!loading && !error && calls.length > 0 && (
              <QuickStats calls={calls} isAdmin={isAdmin} />
            )}

            {/* Date Filter */}
            <DateFilter
              onDateRangeChange={handleDateRangeChange}
              selectedRange={selectedDateRange}
            />

            {loading && (
              <div
                style={{
                  padding: isMobile ? "32px 0" : "40px 0",
                  textAlign: "center",
                  color: "#71717a",
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: 400,
                }}
              >
                Loading...
              </div>
            )}
            {error && (
              <div
                style={{
                  color: "#fca5a5",
                  padding: isMobile ? "20px" : "24px",
                  background: "rgba(239, 68, 68, 0.08)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 12,
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  marginBottom: 20,
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: 400,
                }}
              >
                {error}
              </div>
            )}
            {!loading && !error && (
              <CallList items={filteredCalls} groupByAgent={isAdmin} />
            )}
          </>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#0a0a0a",
      }}
    >
      {/* Sticky Header */}
      <AppHeader user={user} isAdmin={isAdmin} onLogout={onLogout} />

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Navigation Sidebar (Desktop) */}
        {!isMobile && (
          <Navigation
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            isAdmin={isAdmin}
          />
        )}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "20px 16px 80px 16px" : "32px 40px",
            maxWidth: isMobile ? "100%" : "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {renderContent()}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
