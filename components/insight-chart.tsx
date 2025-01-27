'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/lib/hooks/use-user';

interface TaskStats {
  date: string;
  completed: number;
  created: number;
}

export function InsightChart() {
  const [data, setData] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const { user } = useUser();

  const fetchTaskStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : 30;
      const startDate = startOfDay(subDays(new Date(), days - 1));

      // Fetch completed tasks per day
      const { data: completedTasks, error: completedError } = await supabase
        .from('tasks')
        .select('completed_at')
        .gte('completed_at', startDate.toISOString())
        .not('completed_at', 'is', null)
        .in('stack_id', (await supabase
            .from('stacks')
            .select('id')
            .eq('user_id', user.id)).data?.map(stack => stack.id) || []
        );

      if (completedError) throw completedError;

      // Fetch created tasks per day
      const { data: createdTasks, error: createdError } = await supabase
        .from('tasks')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .in('stack_id', 
          (await supabase
            .from('stacks')
            .select('id')
            .eq('user_id', user.id)).data?.map(stack => stack.id) || []
        );

      if (createdError) throw createdError;

      // Process data
      const statsMap = new Map<string, TaskStats>();
      
      // Initialize all dates
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        statsMap.set(date, { date, completed: 0, created: 0 });
      }

      // Count completed tasks
      completedTasks?.forEach(task => {
        const date = format(new Date(task.completed_at!), 'yyyy-MM-dd');
        const stats = statsMap.get(date);
        if (stats) {
          stats.completed += 1;
        }
      });

      // Count created tasks
      createdTasks?.forEach(task => {
        const date = format(new Date(task.created_at), 'yyyy-MM-dd');
        const stats = statsMap.get(date);
        if (stats) {
          stats.created += 1;
        }
      });

      // Convert to array and sort by date
      const statsArray = Array.from(statsMap.values())
        .sort((a, b) => a.date.localeCompare(b.date));

      setData(statsArray);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTaskStats();
    }
  }, [user, timeRange, fetchTaskStats]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Task Insights</h3>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as '7d' | '30d')}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              className="text-muted-foreground text-xs"
            />
            <YAxis className="text-muted-foreground text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
              labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#8B5CF6"
              fill="url(#colorCompleted)"
              strokeWidth={2}
              name="Completed Tasks"
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#3B82F6"
              fill="url(#colorCreated)"
              strokeWidth={2}
              name="Created Tasks"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
