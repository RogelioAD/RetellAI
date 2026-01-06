import React, { useState, useEffect } from "react";
import { useResponsive } from "../../hooks/useResponsive";

/**
 * Date filter component with predefined ranges and calendar selection
 */
export default function DateFilter({ onDateRangeChange, selectedRange = "all", customDateValue = null }) {
  const { isMobile } = useResponsive();
  const [customDate, setCustomDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const showCalendar = selectedRange === "custom";
  const showRangeCalendar = selectedRange === "daterange";

  // Initialize date values from props if available
  useEffect(() => {
    if (customDateValue && typeof customDateValue === 'string') {
      setCustomDate(customDateValue);
    } else if (customDateValue && customDateValue.startDate && customDateValue.endDate) {
      setStartDate(customDateValue.startDate);
      setEndDate(customDateValue.endDate);
    }
  }, [customDateValue]);

  const predefinedRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "week", label: "Week to Date" },
    { value: "month", label: "Month to Date" },
    { value: "year", label: "Year to Date" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "last4months", label: "Last 4 Months" },
    { value: "custom", label: "Select Date" },
    { value: "daterange", label: "Select Range" },
  ];

  const handleRangeChange = (range) => {
    if (range === "custom") {
      onDateRangeChange(range, customDate || null);
    } else if (range === "daterange") {
      onDateRangeChange(range, { startDate, endDate });
    } else {
      setCustomDate("");
      setStartDate("");
      setEndDate("");
      onDateRangeChange(range, null);
    }
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
    if (date) {
      onDateRangeChange("custom", date);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate) {
      onDateRangeChange("daterange", { startDate: date, endDate });
    } else if (date) {
      onDateRangeChange("daterange", { startDate: date, endDate: "" });
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date && startDate) {
      onDateRangeChange("daterange", { startDate, endDate: date });
    } else if (date) {
      onDateRangeChange("daterange", { startDate: "", endDate: date });
    }
  };

  return (
    <div style={{
      marginBottom: isMobile ? "20px" : "24px",
      padding: isMobile ? "16px" : "20px",
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset"
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: isMobile ? "10px" : "12px",
        alignItems: "center",
        marginBottom: (showCalendar || showRangeCalendar) ? "16px" : "0"
      }}>
        {predefinedRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            style={{
              padding: isMobile ? "10px 16px" : "12px 20px",
              fontSize: isMobile ? "13px" : "14px",
              border: selectedRange === range.value 
                ? "1px solid rgba(255, 255, 255, 0.25)" 
                : "1px solid rgba(255, 255, 255, 0.1)",
              background: selectedRange === range.value 
                ? "linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 50%, rgba(240, 147, 251, 0.2) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: selectedRange === range.value ? "#fff" : "#d4d4d8",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: selectedRange === range.value ? 500 : 400,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              boxShadow: selectedRange === range.value 
                ? "0 8px 32px rgba(102, 126, 234, 0.3), 0 1px 0 rgba(255, 255, 255, 0.15) inset"
                : "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={(e) => {
              if (selectedRange !== range.value) {
                e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-1px) scale(1.02)";
                e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1) inset";
              } else {
                e.target.style.transform = "translateY(-1px) scale(1.02)";
                e.target.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.35), 0 2px 0 rgba(255, 255, 255, 0.2) inset";
              }
            }}
            onMouseOut={(e) => {
              if (selectedRange !== range.value) {
                e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset";
              } else {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.3), 0 1px 0 rgba(255, 255, 255, 0.15) inset";
              }
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {showCalendar && (
        <div style={{
          marginTop: "16px",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: 500,
            color: "#a1a1aa"
          }}>
            Select Date:
          </label>
          <input
            type="date"
            value={customDate}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              padding: "12px 16px",
              fontSize: isMobile ? "14px" : "15px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              width: isMobile ? "100%" : "220px",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "#e4e4e7",
              colorScheme: "dark",
              WebkitColorScheme: "dark",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
              WebkitAppearance: "none",
              appearance: "none"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)";
              e.target.style.background = "rgba(255, 255, 255, 0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset";
              e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          />
        </div>
      )}

      {showRangeCalendar && (
        <div style={{
          marginTop: "16px",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: 500,
                color: "#a1a1aa"
              }}>
                Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                max={endDate || new Date().toISOString().split('T')[0]}
                style={{
                  padding: "12px 16px",
                  fontSize: isMobile ? "14px" : "15px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  width: "100%",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "#e4e4e7",
                  colorScheme: "dark",
                  WebkitColorScheme: "dark",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
                  WebkitAppearance: "none",
                  appearance: "none"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset";
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: 500,
                color: "#a1a1aa"
              }}>
                End Date:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  padding: "12px 16px",
                  fontSize: isMobile ? "14px" : "15px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  width: "100%",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "#e4e4e7",
                  colorScheme: "dark",
                  WebkitColorScheme: "dark",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
                  WebkitAppearance: "none",
                  appearance: "none"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset";
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the getDateRange function
export function getDateRange(range, customDateValue = null) {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of today

  let startDate = null;
  let endDate = now;

  switch (range) {
    case "all":
      return { startDate: null, endDate: null };
    
    case "today":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last7days":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "week":
      startDate = new Date(now);
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last3months":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last4months":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 4);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "custom":
      if (customDateValue) {
        startDate = new Date(customDateValue);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customDateValue);
        endDate.setHours(23, 59, 59, 999);
      }
      break;
    
    case "daterange":
      if (customDateValue && customDateValue.startDate && customDateValue.endDate) {
        startDate = new Date(customDateValue.startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customDateValue.endDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (customDateValue && customDateValue.startDate) {
        startDate = new Date(customDateValue.startDate);
        startDate.setHours(0, 0, 0, 0);
      } else if (customDateValue && customDateValue.endDate) {
        endDate = new Date(customDateValue.endDate);
        endDate.setHours(23, 59, 59, 999);
      }
      break;
    
    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
}

