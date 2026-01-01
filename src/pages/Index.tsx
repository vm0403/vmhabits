import { useState } from 'react';
import { ViewType } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import ViewSwitcher from '@/components/ViewSwitcher';
import DailyChecklist from '@/components/DailyChecklist';
import WeeklyReport from '@/components/WeeklyReport';
import MonthlyReport from '@/components/MonthlyReport';
import { Zap } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('daily');
  const {
    habits,
    isLoaded,
    addHabit,
    deleteHabit,
    toggleHabitRecord,
    isHabitCompleted,
    getCompletionCount,
    getHabitCompletionPercentage,
  } = useHabits();

  // Show loading state while habits are being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  Habit Tracker
                </h1>
                <p className="text-xs text-muted-foreground">
                  Build better habits, one day at a time
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* View Switcher */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-center">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {activeView === 'daily' && (
          <DailyChecklist
            habits={habits}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onToggleHabit={toggleHabitRecord}
            isHabitCompleted={isHabitCompleted}
          />
        )}
        {activeView === 'weekly' && (
          <WeeklyReport habits={habits} getCompletionCount={getCompletionCount} />
        )}
        {activeView === 'monthly' && (
          <MonthlyReport
            habits={habits}
            getHabitCompletionPercentage={getHabitCompletionPercentage}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
