import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, DailyData, HabitCompletionData } from '@/types/habit';
import { 
  getMonthDays, 
  getMonthDaysUntilDate, 
  getLastNDays, 
  formatDateLabel,
  getCurrentYear,
  getCurrentMonth,
  getPreviousMonth,
  getNextMonth,
  isCurrentMonth
} from '@/utils/date';

const STORAGE_KEY = 'habit-tracker-data';

// Color palette for charts
const CHART_COLORS = [
  'hsl(168, 60%, 42%)',
  'hsl(28, 85%, 60%)',
  'hsl(200, 60%, 55%)',
  'hsl(280, 60%, 55%)',
  'hsl(340, 70%, 55%)',
  'hsl(45, 80%, 55%)',
  'hsl(120, 50%, 50%)',
  'hsl(0, 70%, 55%)',
];

/**
 * Load habits from localStorage
 * IMPORTANT: This loads the ENTIRE habit history, preserving all records
 */
const loadHabits = (): Habit[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter((habit: unknown) => {
      if (typeof habit !== 'object' || habit === null) return false;
      const h = habit as Record<string, unknown>;
      return (
        typeof h.id === 'number' &&
        typeof h.name === 'string' &&
        typeof h.records === 'object' &&
        h.records !== null
      );
    });
  } catch (error) {
    console.error('Error loading habits from localStorage:', error);
    return [];
  }
};

/**
 * Save habits to localStorage
 * IMPORTANT: This saves the ENTIRE habit history including all records
 * Month navigation does NOT affect what is saved here
 */
const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits to localStorage:', error);
  }
};

/**
 * Custom hook for managing habits with localStorage persistence
 * Supports month navigation while preserving all historical data
 */
export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Month navigation state - defaults to current month
  // These only control WHICH dates are displayed, NOT what is stored
  const [selectedYear, setSelectedYear] = useState(getCurrentYear);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Load habits from localStorage on mount
  // This loads ALL historical data - nothing is filtered or removed
  useEffect(() => {
    const storedHabits = loadHabits();
    setHabits(storedHabits);
    setIsLoaded(true);
  }, []);

  // Save habits to localStorage whenever they change
  // IMPORTANT: This saves the COMPLETE habit history, not just current month
  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits);
    }
  }, [habits, isLoaded]);

  /**
   * Navigate to previous month
   * IMPORTANT: This only changes the view, NOT the stored data
   */
  const goToPreviousMonth = useCallback(() => {
    const { year, month } = getPreviousMonth(selectedYear, selectedMonth);
    setSelectedYear(year);
    setSelectedMonth(month);
  }, [selectedYear, selectedMonth]);

  /**
   * Navigate to next month
   * IMPORTANT: This only changes the view, NOT the stored data
   */
  const goToNextMonth = useCallback(() => {
    const { year, month } = getNextMonth(selectedYear, selectedMonth);
    setSelectedYear(year);
    setSelectedMonth(month);
  }, [selectedYear, selectedMonth]);

  /**
   * Check if currently viewing the current month
   */
  const isViewingCurrentMonth = useMemo(() => {
    return isCurrentMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const addHabit = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now(),
      name: name.trim(),
      records: {},
    };
    
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }, []);

  /**
   * Toggle a habit record for a specific date
   * IMPORTANT: This ONLY updates the specific date, preserving all other records
   */
  const toggleHabitRecord = useCallback((id: number, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        
        // Create a new records object to maintain immutability
        const newRecords = { ...habit.records };
        newRecords[date] = !newRecords[date];
        
        // Remove false entries to keep storage clean
        if (!newRecords[date]) {
          delete newRecords[date];
        }
        
        // Return new habit object, preserving all other records
        return { ...habit, records: newRecords };
      })
    );
  }, []);

  /**
   * Check if a habit is completed for a specific date
   * Reads from the permanent records store
   */
  const isHabitCompleted = useCallback(
    (id: number, date: string): boolean => {
      const habit = habits.find((h) => h.id === id);
      return habit?.records[date] === true;
    },
    [habits]
  );

  // All days in the selected month (for grid display)
  const monthDays = useMemo(() => 
    getMonthDays(selectedYear, selectedMonth), 
    [selectedYear, selectedMonth]
  );
  
  // Days up to today for analytics (only for past/current months)
  const monthDaysUntilToday = useMemo(() => 
    getMonthDaysUntilDate(selectedYear, selectedMonth), 
    [selectedYear, selectedMonth]
  );
  
  const last7Days = useMemo(() => getLastNDays(7), []);

  // Daily completion data for line/bar charts
  // Only shows data for days that have passed in the selected month
  const dailyData = useMemo((): DailyData[] => {
    return monthDaysUntilToday.map((date) => ({
      date,
      label: formatDateLabel(date),
      // Read from permanent records - no data modification
      completed: habits.filter((h) => h.records[date] === true).length,
      total: habits.length,
    }));
  }, [habits, monthDaysUntilToday]);

  // Weekly data (last 7 days) - always shows current week regardless of selected month
  const weeklyData = useMemo((): DailyData[] => {
    return last7Days.map((date) => ({
      date,
      label: formatDateLabel(date),
      completed: habits.filter((h) => h.records[date] === true).length,
      total: habits.length,
    }));
  }, [habits, last7Days]);

  // Habit completion data for pie/bar charts
  // Calculated from permanent records for the selected month
  const habitCompletionData = useMemo((): HabitCompletionData[] => {
    const daysCount = monthDaysUntilToday.length;
    
    return habits.map((habit, index) => {
      // Count completions from permanent records for selected month
      const completed = monthDaysUntilToday.filter((date) => habit.records[date] === true).length;
      return {
        id: habit.id,
        name: habit.name,
        completed,
        total: daysCount,
        percentage: daysCount > 0 ? Math.round((completed / daysCount) * 100) : 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }, [habits, monthDaysUntilToday]);

  // Overall stats for the selected month
  const overallStats = useMemo(() => {
    const totalPossible = monthDaysUntilToday.length * habits.length;
    const totalCompleted = habits.reduce((sum, habit) => {
      return sum + monthDaysUntilToday.filter((date) => habit.records[date] === true).length;
    }, 0);
    const totalMissed = totalPossible - totalCompleted;
    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return {
      totalCompleted,
      totalMissed,
      totalPossible,
      percentage,
      habitsCount: habits.length,
      daysTracked: monthDaysUntilToday.length,
    };
  }, [habits, monthDaysUntilToday]);

  // Cumulative data for running total chart
  const cumulativeData = useMemo(() => {
    let runningTotal = 0;
    return monthDaysUntilToday.map((date) => {
      const completed = habits.filter((h) => h.records[date] === true).length;
      runningTotal += completed;
      return {
        date,
        label: formatDateLabel(date),
        cumulative: runningTotal,
        daily: completed,
      };
    });
  }, [habits, monthDaysUntilToday]);

  return {
    habits,
    isLoaded,
    addHabit,
    deleteHabit,
    toggleHabitRecord,
    isHabitCompleted,
    monthDays,
    dailyData,
    weeklyData,
    habitCompletionData,
    overallStats,
    cumulativeData,
    // Month navigation
    selectedYear,
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isViewingCurrentMonth,
  };
};
