-- Update stacks table
alter table if exists todo_stacks rename to stacks;
alter table if exists stacks add column if not exists archived_at timestamptz;
alter table if exists stacks add column if not exists completed_at timestamptz;

-- Update tasks table
alter table if exists todo_items rename to tasks;
alter table if exists tasks rename column text to title;
alter table if exists tasks drop column if exists completed;
alter table if exists tasks add column if not exists completed_at timestamptz;
