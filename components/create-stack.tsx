'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2 } from 'lucide-react';
import { createStack } from '@/lib/db';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/use-user';

interface CreateStackProps {
  onStackCreated: () => void;
}

export function CreateStack({ onStackCreated }: CreateStackProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleCreateStack = async () => {
    if (!title.trim() || !user) return;

    setLoading(true);
    try {
      await createStack(user.id, title.trim());
      setTitle('');
      toast.success('Stack created successfully');
      onStackCreated();
    } catch (error: any) {
      console.error('Error creating stack:', error);
      toast.error(error.message || 'Failed to create stack');
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
        />
        <Button onClick={handleCreateStack} disabled={loading || !title.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4 mr-2" />
          )}
          Create Stack
        </Button>
      </div>
    </Card>
  );
}
