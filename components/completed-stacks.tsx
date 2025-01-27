'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/use-user';

interface CompletedStack {
  id: string;
  title: string;
  completed_at: string;
  tasks: {
    id: string;
    title: string;
    completed_at: string | null;
  }[];
}

export function CompletedStacks() {
  const [completedStacks, setCompletedStacks] = useState<CompletedStack[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchCompletedStacks();
    }
  }, [user]);

  const fetchCompletedStacks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stacks')
        .select(`
          id,
          title,
          completed_at,
          tasks (
            id,
            title,
            completed_at
          )
        `)
        .eq('user_id', user.id)
        .not('archived_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setCompletedStacks(data || []);
    } catch (error) {
      console.error('Error fetching completed stacks:', error);
      toast.error('Failed to load completed stacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedStacks();
  }, [fetchCompletedStacks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (completedStacks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Completed Stacks</h3>
        <p className="text-muted-foreground">
          Your completed stacks will appear here
        </p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4">
        {completedStacks.map((stack) => (
          <Card key={stack.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{stack.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Completed {format(new Date(stack.completed_at), 'PPP')}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>

            <div className="space-y-2">
              {stack.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-2 text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="line-through">{task.title}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}