import { DailyData, HabitCompletionData } from '@/types/habit';
import { getMonthYearLabel } from '@/utils/date';
import LineCharts from './LineCharts';
import BarCharts from './BarCharts';
import PieCharts from './PieCharts';
import { BarChart3, TrendingUp, Target, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface AnalyticsProps {
  dailyData: DailyData[];
  weeklyData: DailyData[];
  habitCompletionData: HabitCompletionData[];
  cumulativeData: { date: string; label: string; cumulative: number; daily: number }[];
  overallStats: {
    totalCompleted: number;
    totalMissed: number;
    totalPossible: number;
    percentage: number;
    habitsCount: number;
    daysTracked: number;
  };
  selectedYear: number;
  selectedMonth: number;
  isViewingCurrentMonth: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const Analytics = ({
  dailyData,
  weeklyData,
  habitCompletionData,
  cumulativeData,
  overallStats,
  selectedYear,
  selectedMonth,
  isViewingCurrentMonth,
  onPreviousMonth,
  onNextMonth,
}: AnalyticsProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
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
                Analytics Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                {getMonthYearLabel(selectedYear, selectedMonth)}
              </p>
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
        <p className="text-sm text-muted-foreground">
          {overallStats.daysTracked} days tracked
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="stat-value text-primary">{overallStats.habitsCount}</div>
          <div className="stat-label">Total Habits</div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div className="stat-value text-success">{overallStats.totalCompleted}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="stat-value text-accent">{overallStats.percentage}%</div>
          <div className="stat-label">Success Rate</div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="stat-value text-foreground">{overallStats.daysTracked}</div>
          <div className="stat-label">Days Tracked</div>
        </div>
      </div>

      {/* Line Charts Section */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trends
        </h3>
        <LineCharts
          dailyData={dailyData}
          cumulativeData={cumulativeData}
          totalHabits={overallStats.habitsCount}
        />
      </div>

      {/* Bar Charts Section */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Comparisons
        </h3>
        <BarCharts
          weeklyData={weeklyData}
          habitCompletionData={habitCompletionData}
          totalHabits={overallStats.habitsCount}
        />
      </div>

      {/* Pie Charts Section */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Distribution
        </h3>
        <PieCharts
          habitCompletionData={habitCompletionData}
          overallStats={overallStats}
        />
      </div>
    </div>
  );
};

export default Analytics;
