import { Habit } from '@/types/habit';
import { Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitListProps {
  habits: Habit[];
  onDeleteHabit: (id: number) => void;
}

const HabitList = ({ habits, onDeleteHabit }: HabitListProps) => {
  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Your Habits ({habits.length})
      </h3>
      <div className="space-y-2">
        {habits.map((habit, index) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border
                       hover:border-primary/30 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">{habit.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteHabit(habit.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitList;
