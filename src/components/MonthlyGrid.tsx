import { Habit } from '@/types/habit';
import { isToday, getDayFromISO, formatDayShort, getMonthYearLabel } from '@/utils/date';
import HabitForm from './HabitForm';
import HabitRow from './HabitRow';
import { Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
            <div className="min-w-[160px] text-center">
              <h2 className="text-2xl font-display font-semibold text-foreground">
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

                {/* Date headers - dynamically generated for selected month */}
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

              {/* Habit Rows - checkbox values read from habit.records[date] */}
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
