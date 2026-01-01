import { useMemo } from 'react';
import { Habit } from '@/types/habit';
import { getLastNDays, formatDateShort } from '@/utils/date';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface WeeklyReportProps {
  habits: Habit[];
  getCompletionCount: (date: string) => number;
}

const WeeklyReport = ({ habits, getCompletionCount }: WeeklyReportProps) => {
  const last7Days = getLastNDays(7);
  const totalHabits = habits.length;

  // Prepare chart data
  const chartData = useMemo(() => {
    return last7Days.map((date) => ({
      date,
      label: formatDateShort(date),
      completed: getCompletionCount(date),
      total: totalHabits,
    }));
  }, [last7Days, getCompletionCount, totalHabits]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalCompleted = chartData.reduce((sum, day) => sum + day.completed, 0);
    const totalPossible = totalHabits * 7;
    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    const bestDay = chartData.reduce((max, day) => (day.completed > max.completed ? day : max), chartData[0]);
    return { totalCompleted, totalPossible, percentage, bestDay };
  }, [chartData, totalHabits]);

  if (habits.length === 0) {
    return (
      <div className="empty-state py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No data yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Add some habits and start tracking to see your weekly progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Last 7 Days</p>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Weekly Progress
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="habit-card text-center">
          <div className="text-3xl font-display font-bold text-primary">
            {weeklyStats.percentage}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
        </div>
        <div className="habit-card text-center">
          <div className="text-3xl font-display font-bold text-foreground">
            {weeklyStats.totalCompleted}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Habits Completed
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Daily Breakdown</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, Math.max(totalHabits, 1)]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="font-medium text-foreground">{data.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.completed} of {data.total} habits
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.completed === totalHabits && totalHabits > 0
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--chart-2))'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Day Badge */}
      {weeklyStats.bestDay && weeklyStats.bestDay.completed > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
            <span className="text-sm text-muted-foreground">Best day:</span>
            <span className="font-medium text-accent">
              {weeklyStats.bestDay.label} ({weeklyStats.bestDay.completed} habits)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
