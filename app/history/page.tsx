'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface HistoryStack {
  id: string;
  title: string;
  completed_at: string;
  todo_items: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export default function History() {
  const [stacks, setStacks] = useState<HistoryStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('todo_stacks')
        .select(`
          id,
          title,
          completed_at,
          todo_items (
            id,
            text,
            completed
          )
        `)
        .eq('archived', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setStacks(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Task History</h1>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {stacks.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No completed tasks in history</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {stacks.map((stack) => (
                <Card key={stack.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold">{stack.title}</h3>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {format(new Date(stack.completed_at), 'PPP')}
                    </time>
                  </div>

                  <div className="mt-4 space-y-2">
                    {stack.todo_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border p-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="line-through opacity-50">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}