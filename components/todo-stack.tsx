'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Archive, Loader2, Trash2, Flag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TodoStackProps {
  id: string;
  title: string;
  items: TodoItem[];
  onUpdate: () => void;
  archived?: boolean;
}

const CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Finance',
  'Home',
  'Other'
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-blue-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'high', label: 'High', color: 'text-red-500' }
];

export function TodoStack({ id, title, items: initialItems, onUpdate, archived = false }: TodoStackProps) {
  const [items, setItems] = useState(initialItems);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<string>('');
  const [newItemPriority, setNewItemPriority] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todo_items')
        .insert([
          { 
            stack_id: id, 
            text: newItemText.trim(),
            category: newItemCategory || null,
            priority: newItemPriority || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItems([...items, {
        id: data.id,
        text: data.text,
        completed: data.completed,
        category: data.category,
        priority: data.priority
      }]);
      setNewItemText('');
      setNewItemCategory('');
      setNewItemPriority('');
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ 
          completed: !item.completed,
          completed_at: !item.completed ? new Date().toISOString() : null
        })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ));

      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      
      if (updatedItems.every(item => item.completed)) {
        await handleArchiveStack();
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleArchiveStack = async () => {
    try {
      const { error } = await supabase
        .from('todo_stacks')
        .update({ 
          archived: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Stack archived');
      onUpdate();
    } catch (error) {
      console.error('Error archiving stack:', error);
      toast.error('Failed to archive stack');
    }
  };

  const handleRestoreStack = async () => {
    try {
      const { error } = await supabase
        .from('todo_stacks')
        .update({ 
          archived: false,
          completed_at: null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Stack restored');
      onUpdate();
    } catch (error) {
      console.error('Error restoring stack:', error);
      toast.error('Failed to restore stack');
    }
  };

  const handleDeleteStack = async () => {
    try {
      const { error } = await supabase
        .from('todo_stacks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Stack deleted');
      onUpdate();
    } catch (error) {
      console.error('Error deleting stack:', error);
      toast.error('Failed to delete stack');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className="p-4 gradient-card hover:shadow-lg transition-all">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {items.length} completed
          </p>
        </div>
        <div className="flex gap-2">
          {archived ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleRestoreStack}>
                <Archive className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeleteStack}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleArchiveStack}>
              <Archive className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full bg-primary/20 rounded-full mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4">
        {!archived && (
          <div className="space-y-2">
            <Input
              placeholder="New item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddItem();
              }}
            />
            <div className="flex gap-2">
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newItemPriority} onValueChange={setNewItemPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Flag className={`h-4 w-4 ${priority.color}`} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddItem} size="icon" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-lg border p-2 bg-background/50 backdrop-blur-sm"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => handleToggleItem(item.id)}
                disabled={archived}
              />
              <div className="flex-1">
                <span className={item.completed ? 'line-through opacity-50' : ''}>
                  {item.text}
                </span>
                <div className="flex gap-2 mt-1">
                  {item.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {item.category}
                    </span>
                  )}
                  {item.priority && (
                    <span className={`text-xs flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
                      <Flag className="h-3 w-3" />
                      {item.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}