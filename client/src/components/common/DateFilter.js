import React, { useState, useEffect, useRef } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { getDateRange } from "./DateFilterUtils";

/**
 * Date filter component with modal containing dual calendars and filter buttons
 */
export default function DateFilter({ onDateRangeChange, selectedRange = "all", customDateValue = null }) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth1, setViewMonth1] = useState(new Date());
  const [viewMonth2, setViewMonth2] = useState(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next;
  });
  const [selectionMode, setSelectionMode] = useState("date"); // "date", "range", "week"
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const modalRef = useRef(null);

  const predefinedRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "week", label: "Week to Date" },
    { value: "month", label: "Month to Date" },
    { value: "year", label: "Year to Date" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "last4months", label: "Last 4 Months" },
  ];

  // Initialize from props
  useEffect(() => {
    if (customDateValue && typeof customDateValue === 'string') {
      setSelectedDate(customDateValue);
    } else if (customDateValue && customDateValue.startDate && customDateValue.endDate) {
      setSelectedStartDate(customDateValue.startDate);
      setSelectedEndDate(customDateValue.endDate);
    }
  }, [customDateValue]);

  const buttonRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleFilterClick = (range) => {
    setSelectedDate(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedWeek(null);
    onDateRangeChange(range, null);
    setIsOpen(false);
  };

  const handleDateClick = (dateStr) => {
    if (selectionMode === "date") {
      setSelectedDate(dateStr);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectedWeek(null);
      onDateRangeChange("custom", dateStr);
    } else if (selectionMode === "range") {
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        setSelectedStartDate(dateStr);
        setSelectedEndDate(null);
      } else if (selectedStartDate && !selectedEndDate) {
        const start = new Date(selectedStartDate);
        const end = new Date(dateStr);
        if (end < start) {
          setSelectedEndDate(selectedStartDate);
          setSelectedStartDate(dateStr);
        } else {
          setSelectedEndDate(dateStr);
        }
        onDateRangeChange("daterange", {
          startDate: end < start ? dateStr : selectedStartDate,
          endDate: end < start ? selectedStartDate : dateStr
        });
      }
    } else if (selectionMode === "week") {
      const date = new Date(dateStr);
      const weekStart = new Date(date);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekRange = {
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0]
      };
      
      setSelectedWeek(weekRange);
      setSelectedDate(null);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onDateRangeChange("daterange", weekRange);
    }
  };

  const navigateMonths = (direction) => {
    setViewMonth1(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction * 2));
      return newDate;
    });
    setViewMonth2(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction * 2));
      return newDate;
    });
  };

  const getHighlightedDates = () => {
    const { startDate, endDate } = getDateRange(selectedRange, customDateValue);
    const dates = [];
    
    if (startDate && endDate) {
      const current = new Date(startDate);
      while (current <= endDate) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    } else if (startDate) {
      dates.push(startDate.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const highlightedDates = getHighlightedDates();

  return (
    <div style={{ 
      marginBottom: isMobile ? "20px" : "24px",
      position: "relative"
    }}>
      <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: isMobile ? "10px 16px" : "12px 20px",
            fontSize: isMobile ? "13px" : "14px",
            border: selectedRange !== "all" 
              ? "1px solid rgba(236, 72, 153, 0.4)" 
              : "1px solid rgba(255, 255, 255, 0.1)",
            background: selectedRange !== "all"
              ? "rgba(236, 72, 153, 0.15)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: selectedRange !== "all" ? "#fff" : "#d4d4d8",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: selectedRange !== "all" ? 500 : 400,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
            boxShadow: selectedRange !== "all"
              ? "0 2px 8px rgba(236, 72, 153, 0.2)"
              : "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-1px) scale(1.02)";
            e.target.style.boxShadow = selectedRange !== "all"
              ? "0 4px 12px rgba(236, 72, 153, 0.3)"
              : "0 8px 24px rgba(236, 72, 153, 0.2), 0 1px 0 rgba(255, 255, 255, 0.1) inset";
            if (selectedRange === "all") {
              e.target.style.border = "1px solid rgba(236, 72, 153, 0.3)";
              e.target.style.background = "rgba(236, 72, 153, 0.1)";
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = selectedRange !== "all"
              ? "0 2px 8px rgba(236, 72, 153, 0.2)"
              : "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset";
            if (selectedRange === "all") {
              e.target.style.border = "1px solid rgba(255, 255, 255, 0.1)";
              e.target.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)";
            }
          }}
        >
          Date Range
        </button>

      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "12px",
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            maxWidth: isMobile ? "calc(100vw - 32px)" : "900px",
            width: isMobile ? "calc(100vw - 32px)" : "max-content",
            minWidth: isMobile ? "auto" : "800px",
            maxHeight: "80vh",
            overflow: "auto",
            padding: isMobile ? "16px" : "24px",
            zIndex: 1000
          }}
        >
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "24px"
            }}>
              {/* Filter Buttons Sidebar */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minWidth: isMobile ? "100%" : "160px"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a1a1aa",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Quick Filters
                </div>
                {predefinedRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleFilterClick(range.value)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "12px",
                      border: selectedRange === range.value 
                        ? "1px solid rgba(236, 72, 153, 0.5)" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      background: selectedRange === range.value
                        ? "rgba(236, 72, 153, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      color: selectedRange === range.value ? "#fff" : "#d4d4d8",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: selectedRange === range.value ? 500 : 400,
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      width: "100%"
                    }}
                  >
                    {range.label}
                  </button>
                ))}
                
                {/* Selection Mode Buttons */}
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a1a1aa",
                  marginTop: "16px",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Select Mode
                </div>
                <button
                  onClick={() => setSelectionMode("date")}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    border: selectionMode === "date"
                      ? "1px solid rgba(102, 126, 234, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectionMode === "date"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    color: selectionMode === "date" ? "#fff" : "#d4d4d8",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: selectionMode === "date" ? 500 : 400,
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    width: "100%"
                  }}
                >
                  Single Date
                </button>
                <button
                  onClick={() => setSelectionMode("range")}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    border: selectionMode === "range"
                      ? "1px solid rgba(102, 126, 234, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectionMode === "range"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    color: selectionMode === "range" ? "#fff" : "#d4d4d8",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: selectionMode === "range" ? 500 : 400,
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    width: "100%"
                  }}
                >
                  Date Range
                </button>
                <button
                  onClick={() => setSelectionMode("week")}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    border: selectionMode === "week"
                      ? "1px solid rgba(102, 126, 234, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectionMode === "week"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    color: selectionMode === "week" ? "#fff" : "#d4d4d8",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: selectionMode === "week" ? 500 : 400,
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    width: "100%"
                  }}
                >
                  Week Range
                </button>
              </div>

              {/* Calendars Section */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Navigation */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <button
                    onClick={() => navigateMonths(-1)}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(236, 72, 153, 0.1)",
                      border: "1px solid rgba(236, 72, 153, 0.3)",
                      borderRadius: "8px",
                      color: "rgba(244, 114, 182, 0.9)",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(236, 72, 153, 0.2)";
                      e.target.style.borderColor = "rgba(236, 72, 153, 0.5)";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(236, 72, 153, 0.1)";
                      e.target.style.borderColor = "rgba(236, 72, 153, 0.3)";
                      e.target.style.color = "rgba(244, 114, 182, 0.9)";
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "#d4d4d8",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    ✕ Close
                  </button>
                  <button
                    onClick={() => navigateMonths(1)}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(236, 72, 153, 0.1)",
                      border: "1px solid rgba(236, 72, 153, 0.3)",
                      borderRadius: "8px",
                      color: "rgba(244, 114, 182, 0.9)",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(236, 72, 153, 0.2)";
                      e.target.style.borderColor = "rgba(236, 72, 153, 0.5)";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(236, 72, 153, 0.1)";
                      e.target.style.borderColor = "rgba(236, 72, 153, 0.3)";
                      e.target.style.color = "rgba(244, 114, 182, 0.9)";
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Two Calendars */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: isMobile ? "column" : "row"
                }}>
                  <Calendar
                    month={viewMonth1}
                    highlightedDates={highlightedDates}
                    selectedDate={selectedDate}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    selectedWeek={selectedWeek}
                    selectionMode={selectionMode}
                    onDateClick={handleDateClick}
                    isMobile={isMobile}
                  />
                  <Calendar
                    month={viewMonth2}
                    highlightedDates={highlightedDates}
                    selectedDate={selectedDate}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    selectedWeek={selectedWeek}
                    selectionMode={selectionMode}
                    onDateClick={handleDateClick}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

// Calendar Component
function Calendar({ month, highlightedDates, selectedDate, selectedStartDate, selectedEndDate, selectedWeek, selectionMode, onDateClick, isMobile }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getDateString = (day) => {
    if (!day) return null;
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateHighlighted = (dateStr) => highlightedDates.includes(dateStr);

  const isDateInRange = (dateStr) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const date = new Date(dateStr);
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    return date >= start && date <= end;
  };

  const isDateInWeek = (dateStr) => {
    if (!selectedWeek) return false;
    const date = new Date(dateStr);
    const start = new Date(selectedWeek.startDate);
    const end = new Date(selectedWeek.endDate);
    return date >= start && date <= end;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div style={{
      flex: 1,
      background: "rgba(255, 255, 255, 0.04)",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{
        textAlign: "center",
        fontSize: "16px",
        fontWeight: 600,
        color: "#ffffff",
        marginBottom: "16px"
      }}>
        {monthNames[monthIndex]} {year}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginBottom: "8px"
      }}>
        {dayNames.map(day => (
          <div key={day} style={{
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.7)",
            padding: "8px 4px"
          }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px"
      }}>
        {days.map((day, index) => {
          const dateStr = getDateString(day);
          if (!day) {
            return <div key={`empty-${index}`} style={{ aspectRatio: "1", padding: "4px" }} />;
          }

          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr || 
                           (selectionMode === "range" && isDateInRange(dateStr)) ||
                           (selectionMode === "week" && isDateInWeek(dateStr));
          const isHighlighted = isDateHighlighted(dateStr);
          const isStart = selectedStartDate === dateStr;
          const isEnd = selectedEndDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              style={{
                aspectRatio: "1",
                padding: "4px",
                background: isSelected
                  ? "rgba(236, 72, 153, 0.4)"
                  : isHighlighted
                  ? "rgba(236, 72, 153, 0.2)"
                  : "transparent",
                color: isSelected ? "#fff" : isToday ? "rgba(244, 114, 182, 0.9)" : "#ffffff",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isToday ? 600 : 400,
                transition: "all 0.2s ease",
                position: "relative",
                border: isStart || isEnd ? "2px solid rgba(236, 72, 153, 0.8)" : "1px solid transparent"
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.target.style.background = "rgba(236, 72, 153, 0.15)";
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.target.style.background = isHighlighted ? "rgba(236, 72, 153, 0.2)" : "transparent";
                }
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Export the getDateRange function for backward compatibility
export { getDateRange } from "./DateFilterUtils";