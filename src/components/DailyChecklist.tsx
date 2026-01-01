import { Habit } from '@/types/habit';
import { getTodayISO, formatDateLong } from '@/utils/date';
import { Check, Circle, Sparkles } from 'lucide-react';
import HabitForm from './HabitForm';
import HabitList from './HabitList';

interface DailyChecklistProps {
  habits: Habit[];
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: number) => void;
  onToggleHabit: (id: number, date: string) => void;
  isHabitCompleted: (id: number, date: string) => boolean;
}

const DailyChecklist = ({
  habits,
  onAddHabit,
  onDeleteHabit,
  onToggleHabit,
  isHabitCompleted,
}: DailyChecklistProps) => {
  const today = getTodayISO();
  const completedCount = habits.filter((h) => isHabitCompleted(h.id, today)).length;
  const totalHabits = habits.length;
  const allCompleted = totalHabits > 0 && completedCount === totalHabits;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Today</p>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          {formatDateLong(today)}
        </h2>
        {totalHabits > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalHabits) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalHabits}
            </span>
          </div>
        )}
      </div>

      {/* Add Habit Form */}
      <HabitForm onAddHabit={onAddHabit} />

      {/* Empty State */}
      {habits.length === 0 && (
        <div className="empty-state py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No habits yet
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Start building better habits! Add your first habit above to begin tracking your progress.
          </p>
        </div>
      )}

      {/* Habit Checklist */}
      {habits.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Today's Checklist
          </h3>
          <div className="space-y-2">
            {habits.map((habit, index) => {
              const isCompleted = isHabitCompleted(habit.id, today);
              return (
                <button
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id, today)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl border-2
                    transition-all duration-200 ease-out text-left
                    animate-fade-in
                    ${
                      isCompleted
                        ? 'bg-primary/5 border-primary/30'
                        : 'bg-card border-border hover:border-primary/20'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center
                      transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`
                      flex-1 font-medium transition-all duration-200
                      ${isCompleted ? 'text-primary' : 'text-foreground'}
                    `}
                  >
                    {habit.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All Complete Celebration */}
      {allCompleted && (
        <div className="text-center py-6 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">
              All habits completed! Great job! 🎉
            </span>
          </div>
        </div>
      )}

      {/* Habit Management */}
      <div className="pt-4 border-t border-border">
        <HabitList habits={habits} onDeleteHabit={onDeleteHabit} />
      </div>
    </div>
  );
};

export default DailyChecklist;
