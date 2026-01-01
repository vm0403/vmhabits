import { useMemo } from 'react';
import { DailyData } from '@/types/habit';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface LineChartsProps {
  dailyData: DailyData[];
  cumulativeData: { date: string; label: string; cumulative: number; daily: number }[];
  totalHabits: number;
}

const LineCharts = ({ dailyData, cumulativeData, totalHabits }: LineChartsProps) => {
  // Only show data if we have habits
  const hasData = totalHabits > 0 && dailyData.length > 0;

  const maxCompleted = useMemo(() => {
    if (!hasData) return 1;
    return Math.max(...dailyData.map((d) => d.completed), totalHabits);
  }, [dailyData, totalHabits, hasData]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Daily Completion Trend */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Daily Completion Trend</h3>
        </div>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, maxCompleted]}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="hsl(168, 60%, 42%)"
                  strokeWidth={2}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see trend data
            </div>
          )}
        </div>
      </div>

      {/* Cumulative Progress */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Cumulative Progress</h3>
        </div>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Total Completed"
                  stroke="hsl(28, 85%, 60%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add habits to see cumulative data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineCharts;
