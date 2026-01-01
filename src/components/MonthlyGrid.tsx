import { Habit } from '@/types/habit';
import { isToday, getDayFromISO, formatDayShort, getCurrentMonthYear } from '@/utils/date';
import HabitForm from './HabitForm';
import HabitRow from './HabitRow';
import { Calendar, Sparkles } from 'lucide-react';

interface MonthlyGridProps {
  habits: Habit[];
  monthDays: string[];
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: number) => void;
  onToggleHabit: (id: number, date: string) => void;
  isHabitCompleted: (id: number, date: string) => boolean;
}

const MonthlyGrid = ({
  habits,
  monthDays,
  onAddHabit,
  onDeleteHabit,
  onToggleHabit,
  isHabitCompleted,
}: MonthlyGridProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            {getCurrentMonthYear()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} • {monthDays.length} days
          </p>
        </div>
        <div className="w-full sm:w-auto sm:max-w-sm">
          <HabitForm onAddHabit={onAddHabit} />
        </div>
      </div>

      {/* Empty State */}
      {habits.length === 0 ? (
        <div className="empty-state py-16 habit-card">
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
      ) : (
        /* Grid Container */
        <div className="habit-card p-0 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <div className="inline-block min-w-full">
              {/* Header Row - Dates */}
              <div className="flex border-b-2 border-border">
                {/* Empty corner cell */}
                <div className="sticky left-0 z-20 min-w-[180px] w-[180px] px-3 py-3 bg-card border-r border-border flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Habit</span>
                </div>

                {/* Date headers */}
                {monthDays.map((date) => {
                  const day = getDayFromISO(date);
                  const dayName = formatDayShort(date);
                  const today = isToday(date);

                  return (
                    <div
                      key={date}
                      className={`grid-cell flex-col gap-0.5 py-2 ${today ? 'grid-cell-today' : ''}`}
                    >
                      <span className={`text-[10px] uppercase ${today ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                        {dayName}
                      </span>
                      <span className={`text-sm font-medium ${today ? 'text-primary' : 'text-foreground'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Habit Rows */}
              <div>
                {habits.map((habit) => (
                  <div key={habit.id} className="group">
                    <HabitRow
                      habit={habit}
                      monthDays={monthDays}
                      onToggle={onToggleHabit}
                      onDelete={onDeleteHabit}
                      isCompleted={isHabitCompleted}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGrid;
