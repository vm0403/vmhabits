/**
 * Habit data model
 */
export interface Habit {
  id: number;
  name: string;
  records: Record<string, boolean>; // { "YYYY-MM-DD": boolean }
}

/**
 * View types for the habit tracker
 */
export type ViewType = 'daily' | 'weekly' | 'monthly';
