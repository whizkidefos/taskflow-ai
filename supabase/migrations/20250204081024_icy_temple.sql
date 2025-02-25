/*
  # Add due dates and reminders to todo items

  1. Changes
    - Add `due_date` column to todo_items table
    - Add `reminder_date` column to todo_items table
    - Add indexes for performance optimization
    - Add check constraint to ensure reminder_date is before due_date

  2. Indexes
    - Create index on due_date for better query performance
    - Create index on reminder_date for better query performance

  3. Notes
    - Both columns are nullable since not all tasks need due dates/reminders
    - Check constraints ensure data integrity
    - Indexes improve performance for date-based queries
*/

-- Add new columns
ALTER TABLE todo_items
ADD COLUMN due_date timestamptz,
ADD COLUMN reminder_date timestamptz;

-- Add check constraint for reminder before due date
ALTER TABLE todo_items
ADD CONSTRAINT reminder_before_due 
  CHECK (reminder_date IS NULL OR due_date IS NULL OR reminder_date <= due_date);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todo_items_due_date ON todo_items(due_date);
CREATE INDEX IF NOT EXISTS idx_todo_items_reminder_date ON todo_items(reminder_date);