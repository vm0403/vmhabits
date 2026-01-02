import { useState } from 'react';
import { ViewType } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import ViewTabs from '@/components/ViewTabs';
import MonthlyGrid from '@/components/MonthlyGrid';
import Analytics from '@/components/Analytics';
import ThemeToggle from '@/components/ThemeToggle';
import { Zap } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('grid');
  const {
    habits,
    isLoaded,
    addHabit,
    deleteHabit,
    toggleHabitRecord,
    isHabitCompleted,
    monthDays,
    dailyData,
    weeklyData,
    habitCompletionData,
    overallStats,
    cumulativeData,
    // Month navigation - only affects view, NOT stored data
    selectedYear,
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isViewingCurrentMonth,
  } = useHabits();

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
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <div className="flex items-center gap-3">
              <ViewTabs activeView={activeView} onViewChange={setActiveView} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'grid' && (
          <MonthlyGrid
            habits={habits}
            monthDays={monthDays}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            isViewingCurrentMonth={isViewingCurrentMonth}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
            onToggleHabit={toggleHabitRecord}
            isHabitCompleted={isHabitCompleted}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />
        )}
        {activeView === 'analytics' && (
          <Analytics
            dailyData={dailyData}
            weeklyData={weeklyData}
            habitCompletionData={habitCompletionData}
            cumulativeData={cumulativeData}
            overallStats={overallStats}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            isViewingCurrentMonth={isViewingCurrentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
