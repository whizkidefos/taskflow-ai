'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export function InsightsPanel() {
  const weeklyData = [
    { name: 'Mon', completed: 4, pending: 2 },
    { name: 'Tue', completed: 6, pending: 3 },
    { name: 'Wed', completed: 8, pending: 4 },
    { name: 'Thu', completed: 5, pending: 2 },
    { name: 'Fri', completed: 7, pending: 3 },
    { name: 'Sat', completed: 3, pending: 1 },
    { name: 'Sun', completed: 2, pending: 1 },
  ];

  const categoryData = [
    { name: 'Work', value: 35 },
    { name: 'Personal', value: 25 },
    { name: 'Shopping', value: 20 },
    { name: 'Health', value: 20 },
  ];

  const monthlyTrends = [
    { month: 'Jan', tasks: 45, completion: 85 },
    { month: 'Feb', tasks: 52, completion: 78 },
    { month: 'Mar', tasks: 48, completion: 90 },
    { month: 'Apr', tasks: 55, completion: 82 },
    { month: 'May', tasks: 50, completion: 88 },
    { month: 'Jun', tasks: 58, completion: 85 },
  ];

  const priorityData = [
    { name: 'High', completed: 15, total: 20 },
    { name: 'Medium', completed: 25, total: 35 },
    { name: 'Low', completed: 30, total: 40 },
  ];

  const COLORS = [
    'hsl(var(--chart-1))', // Vibrant Pink
    'hsl(var(--chart-2))', // Electric Blue
    'hsl(var(--chart-3))', // Emerald Green
    'hsl(var(--chart-4))', // Bright Yellow
    'hsl(var(--chart-5))'  // Rich Purple
  ];

  const axisStyle = {
    tick: { fill: 'currentColor' },
    axisLine: { stroke: 'currentColor' },
    tickLine: { stroke: 'currentColor' }
  };

  const tooltipStyle = {
    contentStyle: { 
      backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    labelStyle: { color: 'hsl(var(--foreground))' },
    cursor: { fill: 'hsl(var(--accent)/0.1)' }
  };

  // Common axis props to replace defaultProps
  const commonAxisProps = {
    scale: 'auto',
    allowDecimals: true,
    allowDataOverflow: false,
    allowDuplicatedCategory: true,
    hide: false,
    mirror: false,
    orientation: 'bottom',
    padding: { left: 0, right: 0 },
    reversed: false,
    ...axisStyle
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Weekly Activity */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Weekly Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" {...commonAxisProps} />
              <YAxis {...commonAxisProps} orientation="left" />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Task Categories */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Task Categories</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1 }}
              >
                {categoryData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Monthly Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" {...commonAxisProps} />
              <YAxis {...commonAxisProps} orientation="left" />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                name="Total Tasks"
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))' }}
              />
              <Line 
                type="monotone" 
                dataKey="completion" 
                name="Completion Rate (%)"
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Priority Distribution */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Priority Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priorityData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" {...commonAxisProps} />
              <YAxis {...commonAxisProps} orientation="left" />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="total" 
                name="Total Tasks"
                stackId="1"
                stroke="hsl(var(--chart-4))" 
                fill="hsl(var(--chart-4)/0.3)"
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                name="Completed"
                stackId="2"
                stroke="hsl(var(--chart-2))" 
                fill="hsl(var(--chart-2)/0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}