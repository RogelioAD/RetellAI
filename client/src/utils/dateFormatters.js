/**
 * Date formatting utilities
 */

/**
 * Format date to full locale string
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
 * Format date to short date string
 */
export function formatShortDate(date) {
  return new Date(date).toLocaleDateString();
}

/**
 * Format date to time string
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString();
}

/**
 * Format date range label for display in stats
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
    const date = new Date(customDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (selectedRange === "daterange" && customDate) {
    const { startDate, endDate } = customDate;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
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
      const start = new Date(startDate);
      return `From ${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;
    } else if (endDate) {
      const end = new Date(endDate);
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
