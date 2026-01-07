import React, { useState, useEffect, useRef } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { getDateRange } from "./DateFilterUtils";
import Button from "./Button";
import { colors, spacing, typography, borderRadius, shadows } from "../../constants/horizonTheme";

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
    onDateRangeChange(range, null);
    setIsOpen(false);
  };

  const handleDateClick = (dateStr) => {
    // If no date is selected yet, select single date
    if (!selectedDate && !selectedStartDate) {
      setSelectedDate(dateStr);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onDateRangeChange("custom", dateStr);
    }
    // If a single date is selected, start a range
    else if (selectedDate && !selectedStartDate) {
      // If clicking the same date, keep it as single date
      if (selectedDate === dateStr) {
        return; // Keep the single date selection
      }
      // Otherwise, convert to date range
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
    // If a range is already selected, start a new selection
    else if (selectedStartDate && selectedEndDate) {
      // Start a new single date selection
      setSelectedDate(dateStr);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onDateRangeChange("custom", dateStr);
    }
    // If only start date is selected (shouldn't happen with new logic, but handle it)
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
      <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          variant={selectedRange !== "all" ? "primary" : "outline"}
        >
          📅 Date Range
        </Button>

      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: spacing.md,
            background: colors.background.card,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.gray[100]}`,
            boxShadow: shadows.xl,
            maxWidth: isMobile ? "calc(100vw - 32px)" : "750px",
            width: isMobile ? "calc(100vw - 32px)" : "max-content",
            minWidth: isMobile ? "auto" : "650px",
            maxHeight: "75vh",
            overflow: "auto",
            padding: isMobile ? spacing.md : spacing.lg,
            zIndex: 1000,
          }}
        >
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "12px" : "16px"
            }}>
              {/* Filter Buttons Sidebar */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                minWidth: isMobile ? "100%" : "140px"
              }}>
                <div style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.tertiary,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
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
                      border: selectedRange === range.value 
                        ? `1px solid ${colors.brand[500]}` 
                        : `1px solid ${colors.gray[200]}`,
                      background: selectedRange === range.value
                        ? colors.brand[500]
                        : "transparent",
                      color: selectedRange === range.value ? colors.text.white : colors.text.secondary,
                      borderRadius: borderRadius.sm,
                      cursor: "pointer",
                      fontWeight: selectedRange === range.value ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Calendars Section */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "12px" }}>
                {/* Navigation */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Button onClick={() => navigateMonths(-1)} variant="outline" style={{ fontSize: typography.fontSize.xs }}>
                    ← Previous
                  </Button>
                  <Button onClick={() => setIsOpen(false)} variant="outline" style={{ fontSize: typography.fontSize.xs }}>
                    ✕ Close
                  </Button>
                  <Button onClick={() => navigateMonths(1)} variant="outline" style={{ fontSize: typography.fontSize.xs }}>
                    Next →
                  </Button>
                </div>

                {/* Two Calendars */}
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
      )}
    </div>
  );
}

// Calendar Component
function Calendar({ month, highlightedDates, selectedDate, selectedStartDate, selectedEndDate, onDateClick, isMobile }) {
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


  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div style={{
      flex: 1,
      background: colors.gray[50],
      borderRadius: borderRadius.md,
      padding: isMobile ? spacing.sm : spacing.md,
      border: `1px solid ${colors.gray[100]}`,
      overflow: "hidden",
      minWidth: isMobile ? "0" : "auto",
    }}>
      <div style={{
        textAlign: "center",
        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: isMobile ? spacing.md : spacing.md,
      }}>
        {monthNames[monthIndex]} {year}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: isMobile ? "2px" : "3px",
        marginBottom: isMobile ? "6px" : "8px"
      }}>
        {dayNames.map(day => (
          <div key={day} style={{
            textAlign: "center",
            fontSize: isMobile ? typography.fontSize.xs : typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.secondary,
            padding: isMobile ? `${spacing.xs} 1px` : `${spacing.xs} ${spacing.xs}`,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: isMobile ? "2px" : "3px"
      }}>
        {days.map((day, index) => {
          const dateStr = getDateString(day);
          if (!day) {
            return <div key={`empty-${index}`} style={{ aspectRatio: "1", padding: isMobile ? "1px" : "3px", minWidth: 0 }} />;
          }

          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr || isDateInRange(dateStr);
          const isHighlighted = isDateHighlighted(dateStr);
          const isStart = selectedStartDate === dateStr;
          const isEnd = selectedEndDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              style={{
                aspectRatio: "1",
                padding: 0,
                minWidth: 0,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSelected
                  ? colors.brand[500]
                  : isHighlighted
                  ? `${colors.brand[500]}20`
                  : "transparent",
                color: isSelected ? colors.text.white : isToday ? colors.brand[500] : colors.text.primary,
                borderRadius: borderRadius.sm,
                cursor: "pointer",
                fontSize: isMobile ? typography.fontSize.xs : typography.fontSize.xs,
                fontWeight: isToday ? typography.fontWeight.semibold : typography.fontWeight.normal,
                transition: "all 0.2s ease",
                position: "relative",
                border: isStart || isEnd 
                  ? `2px solid ${colors.brand[500]}`
                  : "1px solid transparent",
                boxSizing: "border-box",
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.target.style.background = `${colors.brand[500]}15`;
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.target.style.background = isHighlighted ? `${colors.brand[500]}20` : "transparent";
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