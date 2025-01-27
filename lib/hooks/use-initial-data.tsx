'use client';

import { useState, useEffect } from 'react';
import { useUser } from './use-user';
import { useLoading } from './use-loading';
import { getStacks, getEvents } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export function useInitialData() {
  const { user } = useUser();
  const { setIsLoading } = useLoading();
  const [data, setData] = useState<{
    stacks: any[];
    events: any[];
    stats: any[];
  }>({
    stacks: [],
    events: [],
    stats: [],
  });

  useEffect(() => {
    async function fetchInitialData() {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [stacksData, eventsData, statsData] = await Promise.all([
          getStacks(user.id),
          getEvents(user.id),
          fetchStats(),
        ]);

        setData({
          stacks: stacksData || [],
          events: eventsData || [],
          stats: statsData || [],
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [user, setIsLoading]);

  return data;
}

async function fetchStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('created_at, completed_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
}
