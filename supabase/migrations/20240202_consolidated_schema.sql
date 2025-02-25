-- Drop existing tables if they exist
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS stacks CASCADE;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stacks table
CREATE TABLE stacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT title_length CHECK (char_length(title) > 0)
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    stack_id UUID NOT NULL REFERENCES stacks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    position INTEGER DEFAULT 0,
    CONSTRAINT title_length CHECK (char_length(title) > 0)
);

-- Create indexes for better performance
CREATE INDEX idx_stacks_user_id ON stacks(user_id);
CREATE INDEX idx_stacks_completed ON stacks(is_completed);
CREATE INDEX idx_stacks_archived ON stacks(is_archived);
CREATE INDEX idx_tasks_stack_id ON tasks(stack_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(is_completed);
CREATE INDEX idx_tasks_position ON tasks(position);

-- Enable RLS
ALTER TABLE stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for stacks
DROP POLICY IF EXISTS "Users can view their own stacks" ON stacks;
DROP POLICY IF EXISTS "Users can create their own stacks" ON stacks;
DROP POLICY IF EXISTS "Users can update their own stacks" ON stacks;
DROP POLICY IF EXISTS "Users can delete their own stacks" ON stacks;

CREATE POLICY "Users can view their own stacks"
    ON stacks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stacks"
    ON stacks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stacks"
    ON stacks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stacks"
    ON stacks FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for tasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);
