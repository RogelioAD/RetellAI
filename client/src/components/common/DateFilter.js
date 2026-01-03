import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";

/**
 * Date filter component with predefined ranges and calendar selection
 */
export default function DateFilter({ onDateRangeChange, selectedRange = "all" }) {
  const { isMobile } = useResponsive();
  const [customDate, setCustomDate] = useState("");
  const showCalendar = selectedRange === "custom";

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
  ];

  const handleRangeChange = (range) => {
    if (range === "custom") {
      onDateRangeChange(range, customDate || null);
    } else {
      setCustomDate("");
      onDateRangeChange(range, null);
    }
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
    if (date) {
      onDateRangeChange("custom", date);
    }
  };

  return (
    <div style={{
      marginBottom: isMobile ? "16px" : "20px",
      padding: isMobile ? "12px" : "16px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      border: "1px solid #e0e0e0"
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: isMobile ? "8px" : "10px",
        alignItems: "center",
        marginBottom: showCalendar ? "12px" : "0"
      }}>
        {predefinedRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            style={{
              padding: isMobile ? "8px 12px" : "10px 16px",
              fontSize: isMobile ? "13px" : "14px",
              border: selectedRange === range.value ? "2px solid #007bff" : "1px solid #ccc",
              backgroundColor: selectedRange === range.value ? "#007bff" : "#fff",
              color: selectedRange === range.value ? "#fff" : "#333",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: selectedRange === range.value ? "600" : "400",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
            onMouseOver={(e) => {
              if (selectedRange !== range.value) {
                e.target.style.backgroundColor = "#f0f0f0";
              }
            }}
            onMouseOut={(e) => {
              if (selectedRange !== range.value) {
                e.target.style.backgroundColor = "#fff";
              }
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {showCalendar && (
        <div style={{
          marginTop: "12px",
          padding: "12px",
          backgroundColor: "#fff",
          borderRadius: "6px",
          border: "1px solid #ddd"
        }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: "500",
            color: "#333"
          }}>
            Select Date:
          </label>
          <input
            type="date"
            value={customDate}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              padding: "8px 12px",
              fontSize: isMobile ? "14px" : "15px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: isMobile ? "100%" : "200px",
              cursor: "pointer"
            }}
          />
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
    
    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
}

