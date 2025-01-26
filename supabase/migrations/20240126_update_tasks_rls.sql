-- Drop existing policies
drop policy if exists "Users can view their own tasks" on tasks;
drop policy if exists "Users can create tasks for their own stacks" on tasks;
drop policy if exists "Users can update their own tasks" on tasks;
drop policy if exists "Users can delete their own tasks" on tasks;

-- Enable RLS
alter table tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on tasks for select
  using (
    stack_id in (
      select id from stacks
      where user_id = auth.uid()
    )
  );

create policy "Users can create tasks for their own stacks"
  on tasks for insert
  with check (
    stack_id in (
      select id from stacks
      where user_id = auth.uid()
    )
  );

create policy "Users can update their own tasks"
  on tasks for update
  using (
    stack_id in (
      select id from stacks
      where user_id = auth.uid()
    )
  );

create policy "Users can delete their own tasks"
  on tasks for delete
  using (
    stack_id in (
      select id from stacks
      where user_id = auth.uid()
    )
  );
