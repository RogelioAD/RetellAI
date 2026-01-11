import React, { useState, useEffect, useRef } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { getDateRange } from "./DateFilterUtils";
import Button from "./Button";
import { colors, spacing, typography, borderRadius, glassStyles } from "../../constants/horizonTheme";

// Date filter component with modal containing dual calendars and predefined filter buttons
export default function DateFilter({ onDateRangeChange, selectedRange = "all", customDateValue = null }) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth1, setViewMonth1] = useState(new Date());
  const [viewMonth2, setViewMonth2] = useState(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
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

  // Initializes selected dates from props when customDateValue changes
  useEffect(() => {
    if (customDateValue && typeof customDateValue === 'string') {
      setSelectedDate(customDateValue);
    } else if (customDateValue && customDateValue.startDate && customDateValue.endDate) {
      setSelectedStartDate(customDateValue.startDate);
      setSelectedEndDate(customDateValue.endDate);
    }
  }, [customDateValue]);

  const buttonRef = useRef(null);

  // Closes modal when clicking outside of it
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

  // Handles predefined filter button click
  const handleFilterClick = (range) => {
    setSelectedDate(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateRangeChange(range, null);
    setIsOpen(false);
  };

  // Handles date click on calendar - supports single date and date range selection
  const handleDateClick = (dateStr) => {
    if (!selectedDate && !selectedStartDate) {
      setSelectedDate(dateStr);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onDateRangeChange("custom", dateStr);
    }
    else if (selectedDate && !selectedStartDate) {
      if (selectedDate === dateStr) {
        return;
      }
      const start = new Date(selectedDate);
      const end = new Date(dateStr);
      const startDate = end < start ? dateStr : selectedDate;
      const endDate = end < start ? selectedDate : dateStr;
      
      setSelectedDate(null);
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      onDateRangeChange("daterange", {
        startDate: startDate,
        endDate: endDate
      });
    }
    else if (selectedStartDate && selectedEndDate) {
      setSelectedDate(dateStr);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onDateRangeChange("custom", dateStr);
    }
    else if (selectedStartDate && !selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(dateStr);
      if (end < start) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dateStr);
        onDateRangeChange("daterange", {
          startDate: dateStr,
          endDate: selectedStartDate
        });
      } else {
        setSelectedEndDate(dateStr);
        onDateRangeChange("daterange", {
          startDate: selectedStartDate,
          endDate: dateStr
        });
      }
    }
  };

  // Navigates both calendars by specified direction (months)
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

  // Gets array of dates to highlight based on selected range
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
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        variant={selectedRange !== "all" ? "primary" : "primary"}
      >
        Date Range
      </Button>

      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={modalRef}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: spacing.md,
              ...glassStyles.base,
              borderRadius: borderRadius.lg,
              maxWidth: isMobile ? "calc(100vw - 32px)" : "750px",
              width: isMobile ? "calc(100vw - 32px)" : "max-content",
              minWidth: isMobile ? "auto" : "650px",
              maxHeight: isMobile ? "calc(85vh - 140px)" : "75vh",
              overflowY: "auto",
              overflowX: "hidden",
              padding: isMobile ? spacing.md : spacing.lg,
              paddingBottom: isMobile ? spacing.xl : spacing.lg,
              zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "12px" : "16px"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                minWidth: isMobile ? "100%" : "140px"
              }}>
                <div style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: `${spacing.xs} ${spacing.sm}`,
                  ...glassStyles.subtle,
                  borderRadius: borderRadius.md,
                  display: "inline-block",
                  width: "fit-content",
                }}>
                  Quick Filters
                </div>
                {predefinedRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleFilterClick(range.value)}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      fontSize: typography.fontSize.xs,
                      ...(selectedRange === range.value ? glassStyles.active : glassStyles.subtle),
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      fontWeight: selectedRange === range.value ? typography.fontWeight.bold : typography.fontWeight.semibold,
                      transition: "all 0.3s ease",
                      textAlign: "left",
                      width: "100%",
                      transform: "scale(1)",
                      boxShadow: selectedRange === range.value 
                        ? glassStyles.active.boxShadow 
                        : glassStyles.subtle.boxShadow,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRange !== range.value) {
                        e.currentTarget.style.transform = "scale(1.01)";
                        e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRange !== range.value) {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = glassStyles.subtle.boxShadow;
                      }
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "12px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: spacing.sm,
                }}>
                  <button
                    onClick={() => navigateMonths(-1)}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      fontSize: typography.fontSize.xs,
                      ...glassStyles.subtle,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      fontWeight: typography.fontWeight.bold,
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      boxShadow: glassStyles.subtle.boxShadow,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.01)";
                      e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = glassStyles.subtle.boxShadow;
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      fontSize: typography.fontSize.xs,
                      ...glassStyles.subtle,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      fontWeight: typography.fontWeight.bold,
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      boxShadow: glassStyles.subtle.boxShadow,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.01)";
                      e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = glassStyles.subtle.boxShadow;
                    }}
                  >
                    ✕ Close
                  </button>
                  <button
                    onClick={() => navigateMonths(1)}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      fontSize: typography.fontSize.xs,
                      ...glassStyles.subtle,
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      fontWeight: typography.fontWeight.bold,
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      boxShadow: glassStyles.subtle.boxShadow,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.01)";
                      e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = glassStyles.subtle.boxShadow;
                    }}
                  >
                    Next →
                  </button>
                </div>

                <div style={{
                  display: "flex",
                  gap: isMobile ? "10px" : "12px",
                  flexDirection: isMobile ? "column" : "row"
                }}>
                  <Calendar
                    month={viewMonth1}
                    highlightedDates={highlightedDates}
                    selectedDate={selectedDate}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    onDateClick={handleDateClick}
                    isMobile={isMobile}
                  />
                  <Calendar
                    month={viewMonth2}
                    highlightedDates={highlightedDates}
                    selectedDate={selectedDate}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    onDateClick={handleDateClick}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Calendar component for rendering a single month with date selection
function Calendar({ month, highlightedDates, selectedDate, selectedStartDate, selectedEndDate, onDateClick, isMobile }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getDateString = (day) => {
    if (day === null) return null;
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isInRange = (dateStr) => {
    if (!selectedStartDate || !selectedEndDate || !dateStr) return false;
    const date = new Date(dateStr);
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    return date >= start && date <= end;
  };

  const isStartDate = (dateStr) => {
    return dateStr === selectedStartDate;
  };

  const isEndDate = (dateStr) => {
    return dateStr === selectedEndDate;
  };

  return (
    <div style={{
      flex: 1,
      ...glassStyles.subtle,
      borderRadius: borderRadius.md,
      padding: isMobile ? spacing.sm : spacing.md,
      minWidth: isMobile ? "100%" : "280px",
    }}>
      <div style={{
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: "center",
      }}>
        {monthNames[monthIndex]} {year}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: spacing.xs,
      }}>
        {dayNames.map(day => (
          <div
            key={day}
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.secondary,
              textAlign: "center",
              padding: spacing.xs,
            }}
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateStr = getDateString(day);
          const isHighlighted = highlightedDates.includes(dateStr);
          const isSelected = dateStr === selectedDate;
          const inRange = isInRange(dateStr);
          const isStart = isStartDate(dateStr);
          const isEnd = isEndDate(dateStr);

          if (day === null) {
            return <div key={`empty-${index}`} style={{ padding: spacing.xs }} />;
          }

          return (
            <button
              key={day}
              onClick={() => onDateClick(dateStr)}
              style={{
                padding: spacing.xs,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
                borderRadius: borderRadius.sm,
                cursor: "pointer",
                border: "1px solid transparent",
                background: isSelected || isStart || isEnd
                  ? colors.brand[500]
                  : inRange
                    ? `${colors.brand[500]}20`
                    : isHighlighted
                      ? `${colors.brand[500]}15`
                      : "transparent",
                color: isSelected || isStart || isEnd ? colors.text.white : colors.text.primary,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected && !isStart && !isEnd && !inRange) {
                  e.currentTarget.style.backgroundColor = colors.gray[100];
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && !isStart && !isEnd && !inRange) {
                  e.currentTarget.style.backgroundColor = "transparent";
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
