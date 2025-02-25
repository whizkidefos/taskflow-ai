'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Pencil, X, Save, Trash, GripVertical } from 'lucide-react';
import { Database, TaskPriority } from '@/lib/database.types';
import { TagManager } from './tag-manager';
import { TaskMetadata } from './task-metadata';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  description?: string | null;
  tags?: Tag[] | null;
  due_date?: string | null;
  priority?: TaskPriority | null;
};
type Tag = Database['public']['Tables']['tags']['Row'];

interface DraggableTaskProps {
  task: Task;
  isChecked: boolean;
  isEditing: boolean;
  editValue: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditValueChange: (value: string) => void;
}

export function DraggableTask({
  task,
  isChecked,
  isEditing,
  editValue,
  onToggle,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditValueChange,
}: DraggableTaskProps) {
  const { toast } = useToast();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdateMetadata = async (data: {
    dueDate?: Date | null;
    priority?: TaskPriority;
    description?: string | null;
  }) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          due_date: data.dueDate?.toISOString() || null,
          priority: data.priority,
          description: data.description,
        })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task metadata:', error);
      throw error;
    }
  };

  const handleUpdateTags = async (tagIds: string[]) => {
    try {
      // First, remove all existing tags
      const { error: deleteError } = await supabase
        .from('task_tags')
        .delete()
        .eq('task_id', task.id);

      if (deleteError) throw deleteError;

      // Then add the new tags
      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('task_tags')
          .insert(
            tagIds.map(tagId => ({
              task_id: task.id,
              tag_id: tagId,
            }))
          );

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating task tags:', error);
      throw error;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between space-x-2 bg-background p-2 rounded-md ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center space-x-2 flex-1">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-grab hover:cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Checkbox
          checked={isChecked}
          onCheckedChange={onToggle}
          className="h-5 w-5"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editValue.trim()) {
                    onSave();
                  } else if (e.key === 'Escape') {
                    onCancel();
                  }
                }}
                className="flex-1"
                autoFocus
              />
            ) : (
              <span className={isChecked ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </span>
            )}
          </div>
          {!isEditing && task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          {!isEditing && task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={!editValue.trim()}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <TagManager
              selectedTags={task.tags?.map(t => t.id) || []}
              onTagsChange={handleUpdateTags}
            />
            <TaskMetadata
              dueDate={task.due_date ? new Date(task.due_date) : null}
              priority={task.priority ?? 'low'}
              description={task.description ?? null}
              onUpdate={handleUpdateMetadata}
            />
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
