import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HabitFormProps {
  onAddHabit: (name: string) => void;
}

const HabitForm = ({ onAddHabit }: HabitFormProps) => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName);
      setHabitName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Add a new habit..."
        className="flex-1 bg-card border-border focus:ring-primary"
      />
      <Button
        type="submit"
        disabled={!habitName.trim()}
        className="gap-2 px-4"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add</span>
      </Button>
    </form>
  );
};

export default HabitForm;
