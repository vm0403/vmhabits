import { ViewType } from '@/types/habit';
import { Calendar, BarChart3, PieChart } from 'lucide-react';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'daily', label: 'Daily', icon: <Calendar className="w-4 h-4" /> },
  { id: 'weekly', label: 'Weekly', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'monthly', label: 'Monthly', icon: <PieChart className="w-4 h-4" /> },
];

const ViewSwitcher = ({ activeView, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-200 ease-out
            ${
              activeView === view.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }
          `}
        >
          {view.icon}
          <span className="hidden sm:inline">{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;
