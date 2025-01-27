'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Archive, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoStackProps {
  id?: string;
  title?: string;
  tasks?: Task[];
  onUpdate?: () => void;
}

export function TodoStack({ id, title = 'New Stack', tasks: initialTasks = [], onUpdate }: TodoStackProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('stack_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTasks(data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed_at !== null
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id, fetchTasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ stack_id: id, title: newTaskTitle.trim() }])
        .select()
        .single();

      if (error) throw error;

      setTasks([...tasks, {
        id: data.id,
        title: data.title,
        completed: false
      }]);
      setNewTaskTitle('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !id) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed_at: task.completed ? null : new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleArchiveStack = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('stacks')
        .update({ 
          archived_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Stack archived');
      onUpdate?.();
    } catch (error) {
      console.error('Error archiving stack:', error);
      toast.error('Failed to archive stack');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <Card className="p-4 gradient-card hover:shadow-lg transition-all">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        {id && (
          <Button variant="ghost" size="icon" onClick={handleArchiveStack}>
            <Archive className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-primary/20 rounded-full mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
            }}
          />
          <Button onClick={handleAddTask} size="icon" disabled={loading || !id}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
              />
              <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}