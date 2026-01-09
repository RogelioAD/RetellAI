/**
 * Date formatting utilities
 */

/**
 * Formats date to full locale string with weekday, date, and time.
 */
export function formatFullDate(date) {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formats date to short locale date string.
 */
export function formatShortDate(date) {
  return new Date(date).toLocaleDateString();
}

/**
 * Formats date to locale time string.
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}

/**
 * Formats date range label for display in stats based on selected range type.
 */
export function formatDateRangeLabel(selectedRange, customDate) {
  const rangeLabels = {
    all: "All Time",
    today: "Today",
    last7days: "Last 7 Days",
    week: "Week to Date",
    month: "Month to Date",
    year: "Year to Date",
    last3months: "Last 3 Months",
    last4months: "Last 4 Months",
    custom: null, // Will format from customDate
    daterange: null, // Will format from customDate
  };

  if (selectedRange === "custom" && customDate) {
    // Parse date string (YYYY-MM-DD) to avoid timezone issues
    const [year, month, day] = customDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (selectedRange === "daterange" && customDate) {
    const { startDate, endDate } = customDate;
    if (startDate && endDate) {
      // Parse date strings to avoid timezone issues
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);
      const startFormatted = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
      });
      const endFormatted = end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${startFormatted} - ${endFormatted}`;
    } else if (startDate) {
      const [year, month, day] = startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day);
      return `From ${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;
    } else if (endDate) {
      const [year, month, day] = endDate.split('-').map(Number);
      const end = new Date(year, month - 1, day);
      return `Until ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;
    }
    return "Select Range";
  }

  return rangeLabels[selectedRange] || "Total Calls";
}
