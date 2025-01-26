-- Drop existing todo tables if they exist
drop table if exists public.todo_items;
drop table if exists public.todo_stacks;

-- Drop existing task tables if they exist
drop table if exists public.tasks;
drop table if exists public.stacks;

-- Create fresh stacks table
create table public.stacks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    user_id uuid not null references auth.users(id) on delete cascade,
    archived_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_by uuid references auth.users(id)
);

-- Create fresh tasks table
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    stack_id uuid not null references public.stacks(id) on delete cascade,
    title text not null,
    completed_at timestamp with time zone,
    created_by uuid references auth.users(id)
);

-- Create indexes
create index idx_stacks_user_id on public.stacks(user_id);
create index idx_tasks_stack_id on public.tasks(stack_id);

-- Enable RLS
alter table public.stacks enable row level security;
alter table public.tasks enable row level security;

-- Create stack policies
create policy "Users can view their own stacks"
    on public.stacks for select
    using (auth.uid() = user_id);

create policy "Users can create their own stacks"
    on public.stacks for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own stacks"
    on public.stacks for update
    using (auth.uid() = user_id);

create policy "Users can delete their own stacks"
    on public.stacks for delete
    using (auth.uid() = user_id);

-- Create task policies
create policy "Users can view tasks in their stacks"
    on public.tasks for select
    using (
        exists (
            select 1 from public.stacks
            where id = tasks.stack_id
            and user_id = auth.uid()
        )
    );

create policy "Users can create tasks in their stacks"
    on public.tasks for insert
    with check (
        exists (
            select 1 from public.stacks
            where id = tasks.stack_id
            and user_id = auth.uid()
        )
    );

create policy "Users can update tasks in their stacks"
    on public.tasks for update
    using (
        exists (
            select 1 from public.stacks
            where id = tasks.stack_id
            and user_id = auth.uid()
        )
    );

create policy "Users can delete tasks in their stacks"
    on public.tasks for delete
    using (
        exists (
            select 1 from public.stacks
            where id = tasks.stack_id
            and user_id = auth.uid()
        )
    );
