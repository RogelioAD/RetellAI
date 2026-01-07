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
import { getDateRange } from "../components/common/DateFilterUtils";
import { extractCreatedAt } from "../utils/callDataTransformers";
import { colors, spacing } from "../constants/horizonTheme";

/**
 * Main Dashboard page with Horizon UI layout
 * Clean grid system with proper spacing and visual hierarchy
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
                  color: colors.text.secondary,
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
                  color: colors.error,
                  padding: isMobile ? spacing.xl : spacing['2xl'],
                  background: `${colors.error}08`,
                  borderRadius: "12px",
                  border: `1px solid ${colors.error}`,
                  marginBottom: spacing.xl,
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
        backgroundImage: "url('/colorful.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Subtle overlay for content readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(244, 247, 254, 0.9)",
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
            padding: isMobile ? `${spacing.xl} ${spacing.lg} 80px ${spacing.lg}` : `${spacing['3xl']} ${spacing['4xl']}`,
            maxWidth: "1400px",
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
