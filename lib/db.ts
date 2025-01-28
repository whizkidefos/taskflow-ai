import { supabase } from './supabase';
import { Database } from './database.types';

type Stack = Database['public']['Tables']['stacks']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

// Stack functions
export async function createStack(userId: string, title: string) {
  const { data, error } = await supabase
    .from('stacks')
    .insert([{ title, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function getStacks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('stacks')
      .select(`
        *,
        tasks (
          id,
          title,
          completed_at,
          created_at
        )
      `)
      .eq('user_id', userId)
      .is('completed_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getStacks:', error);
    return [];
  }
}

export async function getCompletedStacks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('stacks')
      .select(`
        *,
        tasks (
          id,
          title,
          completed_at,
          created_at
        )
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getCompletedStacks:', error);
    return [];
  }
}

export async function archiveStack(stackId: string) {
  const { error } = await supabase
    .from('stacks')
    .update({
      completed_at: new Date().toISOString()
    })
    .eq('id', stackId);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

// Task functions
export async function createTask(stackId: string, title: string) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ stack_id: stackId, title }])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

// Event functions
export async function createEvent(
  userId: string,
  title: string,
  date: string,
  type: 'task' | 'meeting' | 'reminder',
  time?: string
) {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        user_id: userId,
        title,
        date,
        time,
        type
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function getEvents(userId: string) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getEvents:', error);
    return [];
  }
}

export async function updateEvent(eventId: string, title: string, date: string, p0: string, p1: string | undefined, updates: Partial<Event>) {
  const { error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}