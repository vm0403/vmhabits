import { useMemo } from 'react';
import { Habit } from '@/types/habit';
import { getCurrentMonthDaysUntilToday, getCurrentMonthYear } from '@/utils/date';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, Target } from 'lucide-react';

interface MonthlyReportProps {
  habits: Habit[];
  getHabitCompletionPercentage: (habitId: number, dates: string[]) => number;
}

// Color palette for pie chart segments
const COLORS = [
  'hsl(168, 60%, 42%)',  // Primary teal
  'hsl(28, 85%, 60%)',   // Accent orange
  'hsl(200, 60%, 55%)',  // Blue
  'hsl(280, 60%, 55%)',  // Purple
  'hsl(340, 70%, 55%)',  // Pink
  'hsl(45, 80%, 55%)',   // Yellow
  'hsl(120, 50%, 50%)',  // Green
  'hsl(0, 70%, 55%)',    // Red
];

const MonthlyReport = ({ habits, getHabitCompletionPercentage }: MonthlyReportProps) => {
  const monthDays = getCurrentMonthDaysUntilToday();
  const monthName = getCurrentMonthYear();

  // Prepare pie chart data
  const chartData = useMemo(() => {
    return habits.map((habit, index) => ({
      id: habit.id,
      name: habit.name,
      percentage: getHabitCompletionPercentage(habit.id, monthDays),
      color: COLORS[index % COLORS.length],
    }));
  }, [habits, monthDays, getHabitCompletionPercentage]);

  // Calculate overall monthly stats
  const overallStats = useMemo(() => {
    if (chartData.length === 0) return { average: 0 };
    const totalPercentage = chartData.reduce((sum, h) => sum + h.percentage, 0);
    return { average: Math.round(totalPercentage / chartData.length) };
  }, [chartData]);

  if (habits.length === 0) {
    return (
      <div className="empty-state py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <PieChartIcon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No data yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Add some habits and start tracking to see your monthly analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Monthly Overview</p>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          {monthName}
        </h2>
      </div>

      {/* Overall Stats */}
      <div className="habit-card text-center">
        <div className="text-4xl font-display font-bold text-primary">
          {overallStats.average}%
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Average Completion Rate
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Based on {monthDays.length} days tracked
        </p>
      </div>

      {/* Pie Chart */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Habit Breakdown</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                label={({ payload }) => `${payload?.percentage ?? 0}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="font-medium text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.percentage}% completion
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Legend */}
      <div className="habit-card">
        <h3 className="font-semibold text-foreground mb-4">All Habits</h3>
        <div className="space-y-3">
          {chartData.map((habit, index) => (
            <div
              key={habit.id}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />
              <span className="flex-1 text-foreground truncate">{habit.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${habit.percentage}%`,
                      backgroundColor: habit.color,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                  {habit.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
