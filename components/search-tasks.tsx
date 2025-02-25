'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/lib/hooks/use-user';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { Search, Tag, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  stack: { title: string };
  tags: { id: string; name: string; color: string }[];
};

interface SearchTasksProps {
  onTaskSelect: (taskId: string, stackId: string) => void;
}

export function SearchTasks({ onTaskSelect }: SearchTasksProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = async (query: string) => {
    if (!user || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          stack:stacks(title),
          tags:task_tags(tag:tags(*))
        `)
        .eq('created_by', user.id)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform the data to match our Task type
      const formattedData = data.map(task => ({
        ...task,
        stack: task.stack as { title: string },
        tags: (task.tags as any[]).map(t => t.tag),
      }));

      setSearchResults(formattedData);
    } catch (error) {
      console.error('Error searching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to search tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Search tasks...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search tasks..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.map((task) => (
            <CommandItem
              key={task.id}
              onSelect={() => {
                onTaskSelect(task.id, task.stack_id);
                setOpen(false);
              }}
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{task.title}</span>
                  {task.due_date && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-xs">
                        {format(new Date(task.due_date), 'MMM d')}
                      </span>
                    </div>
                  )}
                  <AlertCircle
                    className={`h-3 w-3 ${getPriorityColor(task.priority)}`}
                  />
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>in {task.stack.title}</span>
                  {task.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>
                          {task.tags.map(tag => tag.name).join(', ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
