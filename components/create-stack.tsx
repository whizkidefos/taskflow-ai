'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createStack } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

interface CreateStackProps {
  onStackCreated: () => void;
}

export function CreateStack({ onStackCreated }: CreateStackProps) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsCreating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create a stack',
          variant: 'destructive',
        });
        return;
      }

      await createStack(user.id, title.trim());
      setTitle('');
      onStackCreated();
      toast({
        title: 'Success',
        description: 'Stack created successfully',
      });
    } catch (error) {
      console.error('Error creating stack:', error);
      toast({
        title: 'Error',
        description: 'Failed to create stack. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        placeholder="Create a new stack..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isCreating}
        className="flex-1"
      />
      <Button type="submit" disabled={isCreating || !title.trim()}>
        <Plus className="w-4 h-4 mr-2" />
        Create Stack
      </Button>
    </form>
  );
}
