import React, { useState, useMemo, useEffect, useRef, Suspense, lazy } from "react";
import { useCalls } from "../hooks/useCalls";
import { useUsers } from "../hooks/useUsers";
import { useResponsive } from "../hooks/useResponsive";
import CallList from "../components/calls/CallList";
import Navigation from "../components/layout/Navigation";
import AppHeader from "../components/layout/AppHeader";
import QuickStats from "../components/layout/QuickStats";
import DateFilter from "../components/common/DateFilter";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getDateRange } from "../components/common/DateFilterUtils";
import { extractCreatedAt } from "../utils/callDataTransformers";
import { colors, spacing, typography } from "../constants/horizonTheme";

// Lazy-load dashboard sections
const UserManagement = lazy(() => import("../components/admin/UserManagement"));
const Settings = lazy(() => import("./Settings"));

// Main dashboard component with calls, users, and settings navigation sections
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

  // Persist date filter to localStorage
  const getStoredDateFilter = () => {
    try {
      const stored = localStorage.getItem("dashboard_dateFilter");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          range: parsed.range || "all",
          customDate: parsed.customDate || null,
        };
      }
    } catch (e) {
      console.warn("Failed to load date filter from localStorage:", e);
    }
    return { range: "all", customDate: null };
  };

  const storedFilter = getStoredDateFilter();
  const [selectedDateRange, setSelectedDateRange] = useState(storedFilter.range);
  const [customDate, setCustomDate] = useState(storedFilter.customDate);

  // Save date filter to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "dashboard_dateFilter",
        JSON.stringify({
          range: selectedDateRange,
          customDate: customDate,
        })
      );
    } catch (e) {
      console.warn("Failed to save date filter to localStorage:", e);
    }
  }, [selectedDateRange, customDate]);

  // Refreshes calls when switching to the calls section
  const prevCallsSectionRef = useRef(currentSection);
  useEffect(() => {
    if (currentSection === "calls" && prevCallsSectionRef.current !== "calls") {
      refreshCalls();
    }
    prevCallsSectionRef.current = currentSection;
  }, [currentSection, refreshCalls]);

  const timeBasedGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Filters calls based on selected date range
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
      
      if (isNaN(callDate.getTime())) {
        return false;
      }
      
      if (startDate && endDate) {
        return callDate.getTime() >= startDate.getTime() && callDate.getTime() <= endDate.getTime();
      } else if (startDate) {
        return callDate.getTime() >= startDate.getTime();
      } else if (endDate) {
        return callDate.getTime() <= endDate.getTime();
      }
      
      return true;
    });
  }, [calls, selectedDateRange, customDate]);

  // Handles date range filter change
  const handleDateRangeChange = (range, customDateValue) => {
    setSelectedDateRange(range);
    setCustomDate(customDateValue);
  };

  // Renders content based on current section (calls, users, or settings)
  const renderContent = () => {
    switch (currentSection) {
      case "users":
        if (!isAdmin) return null;
        return (
          <div>
            <Suspense
              fallback={
                <div
                  style={{
                    padding: isMobile ? `${spacing["3xl"]} 0` : `${spacing["4xl"]} 0`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <UserManagement
                token={token}
                users={users}
                loading={loadingUsers}
                error={userError}
                onUserCreated={refreshUsers}
                currentUserId={user?.id}
              />
            </Suspense>
          </div>
        );

      case "settings":
        return (
          <div>
            <Suspense
              fallback={
                <div
                  style={{
                    padding: isMobile ? `${spacing["3xl"]} 0` : `${spacing["4xl"]} 0`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Settings token={token} />
            </Suspense>
          </div>
        );

      case "calls":
      default:
        return (
          <>
            <div
              style={{
                marginBottom: spacing['2xl'],
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? typography.fontSize.xl : typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.extrabold,
                  color: colors.text.primary,
                  fontFamily: typography.fontFamily.display,
                  letterSpacing: typography.letterSpacing.tight,
                }}
              >
                {timeBasedGreeting()}, {user?.username || "User"}
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: spacing.xs,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                Here’s your call activity and transcripts.
              </p>
            </div>

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

            <div style={{ marginTop: !loading && !error && calls.length > 0 ? spacing['3xl'] : spacing['2xl'] }}>
              <DateFilter
                onDateRangeChange={handleDateRangeChange}
                selectedRange={selectedDateRange}
                customDateValue={customDate}
              />
            </div>

            {loading && (
              <div
                style={{
                  padding: isMobile ? `${spacing['3xl']} 0` : `${spacing['4xl']} 0`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LoadingSpinner size="lg" />
              </div>
            )}
            {error && (
              <div style={{ marginTop: spacing['2xl'], marginBottom: spacing.xl }}>
                <Alert variant="error" style={{ marginBottom: spacing.md }}>
                  {error}
                </Alert>
                <Button variant="primary" onClick={refreshCalls}>
                  Retry
                </Button>
              </div>
            )}
            {!loading && !error && (
              <div style={{ marginTop: spacing['3xl'] }}>
                <CallList items={filteredCalls} groupByAgent={isAdmin} />
              </div>
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
      {/* Colorful background – fixed, behind everything */}
      <div
        style={{
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
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(244, 247, 254, 0.15)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <AppHeader user={user} isAdmin={isAdmin} onLogout={onLogout} />

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
        <main
          className="hide-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile 
              ? `${spacing['4xl']} ${spacing.lg} 120px ${spacing.lg}` 
              : `${spacing['5xl']} ${spacing['4xl']} 120px ${spacing['4xl']}`,
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

      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdmin={isAdmin}
      />
    </div>
  );
}
