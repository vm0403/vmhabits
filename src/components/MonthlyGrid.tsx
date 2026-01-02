import { Habit } from '@/types/habit';
import { isToday, getDayFromISO, formatDayShort, getMonthYearLabel } from '@/utils/date';
import HabitForm from './HabitForm';
import { Calendar, Sparkles, ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface MonthlyGridProps {
  habits: Habit[];
  monthDays: string[];
  selectedYear: number;
  selectedMonth: number;
  isViewingCurrentMonth: boolean;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: number) => void;
  onToggleHabit: (id: number, date: string) => void;
  isHabitCompleted: (id: number, date: string) => boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthlyGrid = ({
  habits,
  monthDays,
  selectedYear,
  selectedMonth,
  isViewingCurrentMonth,
  onAddHabit,
  onDeleteHabit,
  onToggleHabit,
  isHabitCompleted,
  onPreviousMonth,
  onNextMonth,
}: MonthlyGridProps) => {
  // Calculate grid template columns - fixed habit name column + flexible day columns
  const gridTemplateColumns = `minmax(120px, 160px) repeat(${monthDays.length}, minmax(28px, 1fr))`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousMonth}
              className="h-9 w-9"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground">
                {getMonthYearLabel(selectedYear, selectedMonth)}
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onNextMonth}
              className="h-9 w-9"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {!isViewingCurrentMonth && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Viewing history
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} • {monthDays.length} days
          </p>
          <div className="w-full sm:w-auto sm:max-w-sm">
            <HabitForm onAddHabit={onAddHabit} />
          </div>
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
        /* Grid Container - CSS Grid with responsive columns, NO horizontal scroll */
        <div className="habit-card p-0 overflow-hidden">
          {/* Header Row - Dates */}
          <div
            className="grid border-b-2 border-border"
            style={{ gridTemplateColumns }}
          >
            {/* Corner cell with habit label */}
            <div className="px-2 py-2 bg-card border-r border-border flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">Habit</span>
            </div>

            {/* Date headers - dynamically generated for selected month */}
            {monthDays.map((date) => {
              const day = getDayFromISO(date);
              const dayName = formatDayShort(date);
              const today = isToday(date);

              return (
                <div
                  key={date}
                  className={`flex flex-col items-center justify-center py-1.5 border-r border-b border-border ${
                    today ? 'bg-primary/10' : ''
                  }`}
                >
                  <span className={`text-[9px] uppercase leading-tight ${
                    today ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}>
                    {dayName}
                  </span>
                  <span className={`text-xs font-medium leading-tight ${
                    today ? 'text-primary' : 'text-foreground'
                  }`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Habit Rows - using CSS Grid for proper alignment */}
          <div>
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="grid group"
                style={{ gridTemplateColumns }}
              >
                {/* Habit name column - wraps text, no truncation */}
                <div className="px-2 py-2 bg-card border-r border-b border-border flex items-start gap-1 min-h-[40px]">
                  <span 
                    className="flex-1 text-sm font-medium text-foreground whitespace-normal break-words leading-tight"
                    title={habit.name}
                  >
                    {habit.name}
                  </span>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    aria-label={`Delete ${habit.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Day cells */}
                {monthDays.map((date) => {
                  const completed = isHabitCompleted(habit.id, date);
                  const today = isToday(date);

                  return (
                    <div
                      key={date}
                      className={`flex items-center justify-center border-r border-b border-border py-1.5 ${
                        today ? 'bg-primary/10' : ''
                      }`}
                    >
                      <button
                        onClick={() => onToggleHabit(habit.id, date)}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-150 flex items-center justify-center hover:border-primary/50 ${
                          completed
                            ? 'bg-primary border-primary'
                            : 'border-border'
                        }`}
                        title={`${habit.name} - ${formatDayShort(date)} ${getDayFromISO(date)}`}
                        aria-label={`Toggle ${habit.name} for ${formatDayShort(date)} ${getDayFromISO(date)}`}
                      >
                        {completed && <Check className="w-3 h-3 text-primary-foreground" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGrid;
