/*
  # Add categories and priorities to todo items

  1. Changes
    - Add `category` column to todo_items table
    - Add `priority` column to todo_items table
    - Add check constraint for valid priority values

  2. Notes
    - Categories are free-form text for flexibility
    - Priorities are constrained to specific values
    - Both fields are nullable
*/

-- Add new columns
ALTER TABLE todo_items
ADD COLUMN category text,
ADD COLUMN priority text;

-- Add check constraint for priority values
ALTER TABLE todo_items
ADD CONSTRAINT valid_priority 
  CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_todo_items_category ON todo_items(category);
CREATE INDEX IF NOT EXISTS idx_todo_items_priority ON todo_items(priority);