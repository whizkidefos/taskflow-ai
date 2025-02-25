'use client';

import { useEffect, useState } from 'react';
import { getStacks, type Stack } from '../db';
import { supabase } from '../supabase';

export function useInitialData() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        const data = await getStacks(user.id);
        setStacks(data);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stacks, loading, error };
}