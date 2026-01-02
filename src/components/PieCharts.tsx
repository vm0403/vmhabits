import { useMemo } from 'react';
import { HabitCompletionData } from '@/types/habit';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, Target } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface PieChartsProps {
  habitCompletionData: HabitCompletionData[];
  overallStats: {
    totalCompleted: number;
    totalMissed: number;
    percentage: number;
  };
}

const PieCharts = ({ habitCompletionData, overallStats }: PieChartsProps) => {
  const { isDark } = useTheme();
  const hasData = habitCompletionData.length > 0;

  // Theme-aware colors
  const chartColors = useMemo(() => ({
    success: isDark ? 'hsl(168, 55%, 50%)' : 'hsl(168, 60%, 42%)',
    muted: isDark ? 'hsl(0, 0%, 45%)' : 'hsl(0, 0%, 63%)',
    labelText: isDark ? 'hsl(0, 0%, 98%)' : 'hsl(0, 0%, 100%)',
  }), [isDark]);

  // Overall completion vs missed data
  const overallData = [
    { name: 'Completed', value: overallStats.totalCompleted, color: chartColors.success },
    { name: 'Missed', value: overallStats.totalMissed, color: chartColors.muted },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value?: number; percentage?: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.percentage !== undefined ? `${data.percentage}%` : data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill={chartColors.labelText}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Overall Completion vs Missed */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Overall Completion</h3>
        </div>
        <div className="h-64 w-full">
          {hasData && overallData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see overall data
            </div>
          )}
        </div>
        {hasData && (
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-primary">{overallStats.percentage}%</span>
            <span className="text-sm text-muted-foreground ml-2">overall completion</span>
          </div>
        )}
      </div>

      {/* Habit-wise Percentage */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent-foreground" />
          <h3 className="font-semibold text-foreground">Habit Completion %</h3>
        </div>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={habitCompletionData.map(h => ({ ...h, value: h.percentage }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  labelLine={false}
                >
                  {habitCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see breakdown
            </div>
          )}
        </div>

        {/* Legend */}
        {hasData && (
          <div className="mt-4 space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
            {habitCompletionData.map((habit) => (
              <div key={habit.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="flex-1 text-sm text-foreground whitespace-normal break-words">{habit.name}</span>
                <span className="text-sm font-medium text-muted-foreground">{habit.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieCharts;
