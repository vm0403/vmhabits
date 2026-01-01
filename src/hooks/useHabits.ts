import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, DailyData, HabitCompletionData } from '@/types/habit';
import { getCurrentMonthDays, getCurrentMonthDaysUntilToday, getLastNDays, formatDateLabel } from '@/utils/date';

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
 */
export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load habits from localStorage on mount
  useEffect(() => {
    const storedHabits = loadHabits();
    setHabits(storedHabits);
    setIsLoaded(true);
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits);
    }
  }, [habits, isLoaded]);

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

  const toggleHabitRecord = useCallback((id: number, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        
        const newRecords = { ...habit.records };
        newRecords[date] = !newRecords[date];
        
        if (!newRecords[date]) {
          delete newRecords[date];
        }
        
        return { ...habit, records: newRecords };
      })
    );
  }, []);

  const isHabitCompleted = useCallback(
    (id: number, date: string): boolean => {
      const habit = habits.find((h) => h.id === id);
      return habit?.records[date] === true;
    },
    [habits]
  );

  // Memoized analytics data
  const monthDays = useMemo(() => getCurrentMonthDays(), []);
  const monthDaysUntilToday = useMemo(() => getCurrentMonthDaysUntilToday(), []);
  const last7Days = useMemo(() => getLastNDays(7), []);

  // Daily completion data for line/bar charts
  const dailyData = useMemo((): DailyData[] => {
    return monthDaysUntilToday.map((date) => ({
      date,
      label: formatDateLabel(date),
      completed: habits.filter((h) => h.records[date] === true).length,
      total: habits.length,
    }));
  }, [habits, monthDaysUntilToday]);

  // Weekly data (last 7 days)
  const weeklyData = useMemo((): DailyData[] => {
    return last7Days.map((date) => ({
      date,
      label: formatDateLabel(date),
      completed: habits.filter((h) => h.records[date] === true).length,
      total: habits.length,
    }));
  }, [habits, last7Days]);

  // Habit completion data for pie/bar charts
  const habitCompletionData = useMemo((): HabitCompletionData[] => {
    const daysCount = monthDaysUntilToday.length;
    
    return habits.map((habit, index) => {
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

  // Overall stats
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
  };
};
