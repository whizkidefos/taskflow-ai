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

export function InsightChart({ initialData = [] }: { initialData: any[] }) {
  const [data, setData] = useState<TaskStats[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const { user } = useUser();

  useEffect(() => {
    if (!initialData.length) return;
    
    const processedData = processData(initialData, timeRange);
    setData(processedData);
  }, [initialData, timeRange]);

  const processData = (rawData: any[], range: '7d' | '30d') => {
    const days = range === '7d' ? 7 : 30;
    const dates = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    return dates.map(date => {
      const dayData = rawData.filter(task => {
        const taskDate = format(new Date(task.created_at), 'yyyy-MM-dd');
        return taskDate === date;
      });

      return {
        date,
        created: dayData.length,
        completed: dayData.filter(task => task.completed_at).length
      };
    });
  };

  return (
    <Card className="p-4">
      <div className="mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Task Insights</h2>
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
      </div>
    </Card>
  );
}
