'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateStackProps {
  onStackCreated: () => void;
}

export function CreateStack({ onStackCreated }: CreateStackProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateStack = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('todo_stacks')
        .insert([
          { title: title.trim(), user_id: user.id }
        ]);

      if (error) throw error;

      setTitle('');
      toast.success('Stack created successfully');
      onStackCreated();
    } catch (error) {
      console.error('Error creating stack:', error);
      toast.error('Failed to create stack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-2">
        <Input
          placeholder="New stack name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateStack();
          }}
          className="max-w-sm"
        />
        <Button onClick={handleCreateStack} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          Create Stack
        </Button>
      </div>
    </Card>
  );
}