/**
 * Date utility functions for the Habit Tracker
 * All dates are handled in ISO format: YYYY-MM-DD
 */

/**
 * Get current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Get current month (0-based)
 */
export const getCurrentMonth = (): number => {
  return new Date().getMonth();
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Format a date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the last N days including today
 */
export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDateISO(date));
  }
  
  return dates;
};

/**
 * Get all days in the current month
 */
export const getCurrentMonthDays = (): string[] => {
  const today = new Date();
  return getMonthDays(today.getFullYear(), today.getMonth());
};

/**
 * Get all days for a specific month and year
 * This is the primary function for month navigation
 */
export const getMonthDays = (year: number, month: number): string[] => {
  // Handle leap years correctly
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: string[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(formatDateISO(date));
  }
  
  return days;
};

/**
 * Get days in the current month up to today
 */
export const getCurrentMonthDaysUntilToday = (): string[] => {
  const today = new Date();
  return getMonthDaysUntilDate(today.getFullYear(), today.getMonth(), today);
};

/**
 * Get days in a specific month up to a given date
 * If the month is in the past, returns all days
 * If the month is in the future, returns empty array
 * If the month is current, returns days up to today
 */
export const getMonthDaysUntilDate = (year: number, month: number, referenceDate: Date = new Date()): string[] => {
  const today = referenceDate;
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: string[] = [];
  
  // If viewing a future month, return empty array
  if (year > todayYear || (year === todayYear && month > todayMonth)) {
    return days;
  }
  
  // Determine the last day to include
  let lastDay = daysInMonth;
  if (year === todayYear && month === todayMonth) {
    lastDay = todayDay;
  }
  
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    days.push(formatDateISO(date));
  }
  
  return days;
};

/**
 * Format date for display (e.g., "Mon")
 */
export const formatDayShort = (dateISO: string): string => {
  const date = new Date(dateISO + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Format date for chart label (e.g., "Jan 15")
 */
export const formatDateLabel = (dateISO: string): string => {
  const date = new Date(dateISO + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Get current month name and year
 */
export const getCurrentMonthYear = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Get month name and year for a specific month/year
 */
export const getMonthYearLabel = (year: number, month: number): string => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Get day number from ISO date
 */
export const getDayFromISO = (dateISO: string): number => {
  const date = new Date(dateISO + 'T00:00:00');
  return date.getDate();
};

/**
 * Check if a date is today
 */
export const isToday = (dateISO: string): boolean => {
  return dateISO === getTodayISO();
};

/**
 * Check if we're viewing the current month
 */
export const isCurrentMonth = (year: number, month: number): boolean => {
  const today = new Date();
  return year === today.getFullYear() && month === today.getMonth();
};

/**
 * Get previous month and year (handles year rollover)
 */
export const getPreviousMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
};

/**
 * Get next month and year (handles year rollover)
 */
export const getNextMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
};

/**
 * Get week number for grouping
 */
export const getWeekOfMonth = (dateISO: string): number => {
  const date = new Date(dateISO + 'T00:00:00');
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
};
