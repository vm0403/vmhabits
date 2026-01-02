import { useMemo } from 'react';
import { DailyData, HabitCompletionData } from '@/types/habit';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface BarChartsProps {
  weeklyData: DailyData[];
  habitCompletionData: HabitCompletionData[];
  totalHabits: number;
}

const BarCharts = ({ weeklyData, habitCompletionData, totalHabits }: BarChartsProps) => {
  const { isDark } = useTheme();
  const hasData = totalHabits > 0;

  // Theme-aware colors
  const chartColors = useMemo(() => ({
    grid: 'hsl(var(--border))',
    text: 'hsl(var(--muted-foreground))',
    success: isDark ? 'hsl(168, 55%, 50%)' : 'hsl(168, 60%, 42%)',
    successFull: isDark ? 'hsl(168, 60%, 55%)' : 'hsl(168, 50%, 55%)',
  }), [isDark]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload?: { name?: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-foreground">{payload[0]?.payload?.name || label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weekly Completion */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Last 7 Days</h3>
        </div>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  domain={[0, Math.max(totalHabits, 1)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.completed === totalHabits && totalHabits > 0 ? chartColors.success : chartColors.successFull}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see weekly data
            </div>
          )}
        </div>
      </div>

      {/* Habit-wise Completion */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent-foreground" />
          <h3 className="font-semibold text-foreground">Habit Completion Count</h3>
        </div>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={habitCompletionData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" radius={[0, 6, 6, 0]} maxBarSize={30}>
                  {habitCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see completion data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarCharts;
