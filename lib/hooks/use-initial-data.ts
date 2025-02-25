import { useState, useEffect, useCallback } from 'react';
import { useUser } from './use-user';
import { supabase } from '../supabase';
import { getStacks, getCompletedStacks } from '../db';
import { useToast } from '@/components/ui/use-toast';

export function useInitialData() {
  const { user } = useUser();
  const [stacks, setStacks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch active and completed stacks
      const [activeStacks, completedStacks] = await Promise.all([
        getStacks(user.id),
        getCompletedStacks(user.id),
      ]);

      // Combine and sort stacks
      const allStacks = [...(activeStacks || []), ...(completedStacks || [])];
      setStacks(allStacks);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Calculate stats
      const totalTasks = allStacks.reduce((acc, stack) => acc + (stack.tasks?.length || 0), 0);
      const completedTasks = allStacks.reduce(
        (acc, stack) => acc + (stack.tasks?.filter((t: any) => t.completed_at)?.length || 0),
        0
      );

      setStats({
        totalStacks: allStacks.length,
        activeStacks: activeStacks?.length || 0,
        completedStacks: completedStacks?.length || 0,
        totalTasks,
        completedTasks,
        completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) return;

    fetchData();

    // Set up real-time subscriptions
    const stacksChannel = supabase
      .channel('stacks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stacks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      stacksChannel.unsubscribe();
      tasksChannel.unsubscribe();
      eventsChannel.unsubscribe();
    };
  }, [user, fetchData]);

  return {
    stacks,
    events,
    stats,
    loading,
    refreshData: fetchData,
  };
}
