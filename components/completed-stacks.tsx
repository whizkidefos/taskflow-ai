'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TodoStack } from './todo-stack';

interface CompletedStack {
  id: string;
  title: string;
  completed_at: string;
  todo_items: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

const ITEMS_PER_PAGE = 6;

export function CompletedStacks() {
  const [completedStacks, setCompletedStacks] = useState<CompletedStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalStacks, setTotalStacks] = useState(0);

  const fetchCompletedStacks = async () => {
    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('todo_stacks')
        .select('*', { count: 'exact', head: true })
        .eq('archived', true);

      if (countError) throw countError;
      setTotalStacks(count || 0);

      // Get paginated data
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
        .order('completed_at', { ascending: false })
        .range(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      setCompletedStacks(data);
    } catch (error) {
      console.error('Error fetching completed stacks:', error);
      toast.error('Failed to load completed stacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedStacks();
  }, [currentPage]);

  const totalPages = Math.ceil(totalStacks / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (completedStacks.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No completed stacks yet.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {completedStacks.map((stack) => (
          <TodoStack
            key={stack.id}
            id={stack.id}
            title={stack.title}
            items={stack.todo_items}
            onUpdate={fetchCompletedStacks}
            archived={true}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}