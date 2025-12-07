/**
 * Date utility functions for formatting and converting dates
 * All dates from backend are in UTC, we convert to local time for display
 */

/**
 * Format date to "Jan 10, 2025" format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime to "Jan 10, 2025, 10:00 AM" format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format time to "10:00 AM" format
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Convert local date to UTC ISO string for API
 * @param {Date} date - Local date object
 * @returns {string} UTC ISO string
 */
export const toUTCString = (date) => {
  return date.toISOString();
};

/**
 * Get start of day in local time, then convert to UTC
 * Used for all-day events
 * @param {Date} date - Date object
 * @returns {Date} Date at start of day in UTC
 */
export const getStartOfDayUTC = (date) => {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

/**
 * Get end of day in local time, then convert to UTC
 * Used for all-day events
 * @param {Date} date - Date object
 * @returns {Date} Date at end of day in UTC
 */
export const getEndOfDayUTC = (date) => {
  const localDate = new Date(date);
  localDate.setHours(23, 59, 59, 999);
  return localDate;
};

