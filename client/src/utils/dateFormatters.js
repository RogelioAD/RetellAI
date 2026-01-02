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

