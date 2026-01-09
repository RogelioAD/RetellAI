import React, { useState, useMemo, useEffect, useRef } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import UserManagement from "../components/admin/UserManagement";
import Settings from "./Settings";
import Navigation from "../components/layout/Navigation";
import AppHeader from "../components/layout/AppHeader";
import QuickStats from "../components/layout/QuickStats";
import DateFilter from "../components/common/DateFilter";
import Alert from "../components/common/Alert";
import { getDateRange } from "../components/common/DateFilterUtils";
import { extractCreatedAt } from "../utils/callDataTransformers";
import { colors, spacing, typography } from "../constants/horizonTheme";

/**
 * Main dashboard component with calls, users, and settings navigation sections.
 */
export default function Dashboard({ token, user, onLogout }) {
  const { isMobile } = useResponsive();
  const isAdmin = user?.role === "admin";
  const { calls, loading, error, totalCount, refreshCalls } = useCalls(token, isAdmin);
  
  const [currentSection, setCurrentSection] = useState("calls");
  const { users, loading: loadingUsers, error: userError, refreshUsers } = useUsers(
    token,
    isAdmin,
    currentSection === "users"
  );

  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [customDate, setCustomDate] = useState(null);

  // Refresh calls when switching to the calls section
  const prevSectionRef = useRef(currentSection);
  useEffect(() => {
    if (currentSection === "calls" && prevSectionRef.current !== "calls") {
      refreshCalls();
    }
    prevSectionRef.current = currentSection;
  }, [currentSection, refreshCalls]);

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
      const callDateStr = extractCreatedAt(call, mapping);
      const callDate = new Date(callDateStr);
      
      // Handle invalid dates
      if (isNaN(callDate.getTime())) {
        return false;
      }
      
      if (startDate && endDate) {
        // Ensure we're comparing dates correctly - callDate should be >= startDate and <= endDate
        return callDate.getTime() >= startDate.getTime() && callDate.getTime() <= endDate.getTime();
      } else if (startDate) {
        return callDate.getTime() >= startDate.getTime();
      } else if (endDate) {
        return callDate.getTime() <= endDate.getTime();
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
              <QuickStats 
                calls={calls}
                filteredCalls={filteredCalls}
                isAdmin={isAdmin}
                selectedRange={selectedDateRange}
                customDate={customDate}
                totalCount={totalCount}
              />
            )}

            {/* Date Filter */}
            <DateFilter
              onDateRangeChange={handleDateRangeChange}
              selectedRange={selectedDateRange}
              customDateValue={customDate}
            />

            {loading && (
              <div
                style={{
                  padding: isMobile ? `${spacing['3xl']} 0` : `${spacing['4xl']} 0`,
                  textAlign: "center",
                  color: colors.text.white,
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Loading...
              </div>
            )}
            {error && (
              <Alert variant="error" style={{ marginBottom: spacing.xl }}>
                {error}
              </Alert>
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
        position: "relative",
      }}
    >
      {/* Fixed background image */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      
      {/* Subtle overlay for content readability */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(244, 247, 254, 0.4)",
        zIndex: 0,
        pointerEvents: "none",
      }} />
      
      {/* Sticky Header */}
      <AppHeader user={user} isAdmin={isAdmin} onLogout={onLogout} />

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile 
              ? `${spacing.xl} ${spacing.lg} 120px ${spacing.lg}` 
              : `${spacing['3xl']} ${spacing['4xl']} 120px ${spacing['4xl']}`,
            paddingLeft: isMobile ? spacing.lg : spacing['4xl'],
            paddingBottom: isMobile ? "140px" : "120px",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {renderContent()}
        </main>
      </div>

      {/* Bottom Navigation (Centered for both mobile and desktop) */}
      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdmin={isAdmin}
      />
    </div>
  );
}
