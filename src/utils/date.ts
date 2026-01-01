/**
 * Date utility functions for the Habit Tracker
 * All dates are handled in ISO format: YYYY-MM-DD
 */

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
  const year = today.getFullYear();
  const month = today.getMonth();
  
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
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();
  
  const days: string[] = [];
  
  for (let day = 1; day <= currentDay; day++) {
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
 * Get week number for grouping
 */
export const getWeekOfMonth = (dateISO: string): number => {
  const date = new Date(dateISO + 'T00:00:00');
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
};
