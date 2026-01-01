import { ViewType } from '@/types/habit';
import { Grid3X3, BarChart3 } from 'lucide-react';

interface ViewTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'grid', label: 'Monthly Grid', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

const ViewTabs = ({ activeView, onViewChange }: ViewTabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`view-tab flex items-center gap-2 ${
            activeView === view.id ? 'view-tab-active' : 'view-tab-inactive'
          }`}
        >
          {view.icon}
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
