'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getCompletedStacks } from '@/lib/db';
import { useUser } from '@/lib/hooks/use-user';
import { format } from 'date-fns';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function CompletedStacks() {
  const { user } = useUser();
  const [stacks, setStacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedStacks() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCompletedStacks(user.id);
        setStacks(data || []);
      } catch (error) {
        console.error('Error fetching completed stacks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedStacks();
  }, [user]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading completed stacks...</span>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Please sign in to view completed stacks
        </div>
      </Card>
    );
  }

  if (stacks.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No completed stacks yet
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {stacks.map((stack) => (
        <Card key={stack.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">{stack.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Completed {format(new Date(stack.completed_at), 'PPP')}
              </p>
              <div className="mt-4 space-y-2">
                {stack.tasks?.map((task: any) => (
                  <div key={task.id} className="text-sm text-muted-foreground">
                    • {task.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}