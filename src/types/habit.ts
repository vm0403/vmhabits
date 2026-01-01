/**
 * Habit data model
 */
export interface Habit {
  id: number;
  name: string;
  records: Record<string, boolean>;
}

/**
 * View types for the habit tracker
 */
export type ViewType = 'grid' | 'analytics';

/**
 * Chart data types
 */
export interface DailyData {
  date: string;
  label: string;
  completed: number;
  total: number;
}

export interface HabitCompletionData {
  id: number;
  name: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}
