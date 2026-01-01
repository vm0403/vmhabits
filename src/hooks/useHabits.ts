import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

/**
 * Load habits from localStorage
 */
const loadHabits = (): Habit[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate the data structure
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

  /**
   * Add a new habit
   */
  const addHabit = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now(),
      name: name.trim(),
      records: {},
    };
    
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  /**
   * Delete a habit by ID
   */
  const deleteHabit = useCallback((id: number) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }, []);

  /**
   * Toggle habit completion for a specific date
   */
  const toggleHabitRecord = useCallback((id: number, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        
        const newRecords = { ...habit.records };
        newRecords[date] = !newRecords[date];
        
        // Remove the record if it's false to keep storage clean
        if (!newRecords[date]) {
          delete newRecords[date];
        }
        
        return { ...habit, records: newRecords };
      })
    );
  }, []);

  /**
   * Check if a habit is completed for a specific date
   */
  const isHabitCompleted = useCallback(
    (id: number, date: string): boolean => {
      const habit = habits.find((h) => h.id === id);
      return habit?.records[date] === true;
    },
    [habits]
  );

  /**
   * Get completion count for a specific date
   */
  const getCompletionCount = useCallback(
    (date: string): number => {
      return habits.filter((habit) => habit.records[date] === true).length;
    },
    [habits]
  );

  /**
   * Get habit completion percentage for a date range
   */
  const getHabitCompletionPercentage = useCallback(
    (habitId: number, dates: string[]): number => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit || dates.length === 0) return 0;
      
      const completedDays = dates.filter((date) => habit.records[date] === true).length;
      return Math.round((completedDays / dates.length) * 100);
    },
    [habits]
  );

  return {
    habits,
    isLoaded,
    addHabit,
    deleteHabit,
    toggleHabitRecord,
    isHabitCompleted,
    getCompletionCount,
    getHabitCompletionPercentage,
  };
};
