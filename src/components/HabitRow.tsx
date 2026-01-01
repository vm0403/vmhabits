import { Habit } from '@/types/habit';
import { Check, Trash2 } from 'lucide-react';
import { isToday, getDayFromISO, formatDayShort } from '@/utils/date';

interface HabitRowProps {
  habit: Habit;
  monthDays: string[];
  onToggle: (habitId: number, date: string) => void;
  onDelete: (habitId: number) => void;
  isCompleted: (habitId: number, date: string) => boolean;
}

const HabitRow = ({ habit, monthDays, onToggle, onDelete, isCompleted }: HabitRowProps) => {
  return (
    <div className="flex">
      {/* Sticky habit name column */}
      <div className="sticky left-0 z-10 flex items-center gap-2 min-w-[180px] w-[180px] px-3 py-2 bg-card border-r border-b border-border">
        <span className="flex-1 font-medium text-foreground truncate" title={habit.name}>
          {habit.name}
        </span>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day cells */}
      {monthDays.map((date) => {
        const completed = isCompleted(habit.id, date);
        const today = isToday(date);

        return (
          <div
            key={date}
            className={`grid-cell ${today ? 'grid-cell-today' : ''}`}
          >
            <button
              onClick={() => onToggle(habit.id, date)}
              className={`grid-checkbox ${completed ? 'grid-checkbox-checked' : ''}`}
              title={`${habit.name} - ${formatDayShort(date)} ${getDayFromISO(date)}`}
            >
              {completed && <Check className="w-4 h-4 text-primary-foreground" />}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default HabitRow;
