/*
  # Initial schema setup for TaskFlow AI

  1. Tables
    - todo_stacks: Main table for task stacks
      - id (uuid, primary key)
      - title (text)
      - user_id (uuid, references auth.users)
      - created_at (timestamptz)
      - completed_at (timestamptz)
      - archived (boolean)
    
    - todo_items: Table for individual todo items
      - id (uuid, primary key)
      - stack_id (uuid, references todo_stacks)
      - text (text)
      - completed (boolean)
      - created_at (timestamptz)
      - completed_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create todo_stacks table
CREATE TABLE IF NOT EXISTS todo_stacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  archived boolean DEFAULT false,
  CONSTRAINT title_length CHECK (char_length(title) >= 1)
);

-- Create todo_items table with explicit foreign key
CREATE TABLE IF NOT EXISTS todo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_id uuid REFERENCES todo_stacks(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT text_length CHECK (char_length(text) >= 1)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todo_stacks_user_id ON todo_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_items_stack_id ON todo_items(stack_id);
CREATE INDEX IF NOT EXISTS idx_todo_stacks_archived ON todo_stacks(archived);

-- Enable RLS
ALTER TABLE todo_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Policies for todo_stacks
CREATE POLICY "Users can view their own stacks"
  ON todo_stacks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stacks"
  ON todo_stacks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stacks"
  ON todo_stacks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for todo_items
CREATE POLICY "Users can view items in their stacks"
  ON todo_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_stacks
      WHERE todo_stacks.id = todo_items.stack_id
      AND todo_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items in their stacks"
  ON todo_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_stacks
      WHERE todo_stacks.id = todo_items.stack_id
      AND todo_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their stacks"
  ON todo_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_stacks
      WHERE todo_stacks.id = todo_items.stack_id
      AND todo_stacks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in their stacks"
  ON todo_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_stacks
      WHERE todo_stacks.id = todo_items.stack_id
      AND todo_stacks.user_id = auth.uid()
    )
  );