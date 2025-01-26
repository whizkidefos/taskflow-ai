-- Create todo_stacks table
CREATE TABLE public.todo_stacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    archived BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create todo_items table
CREATE TABLE public.todo_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    stack_id UUID NOT NULL REFERENCES public.todo_stacks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_todo_stacks_user_id ON public.todo_stacks(user_id);
CREATE INDEX idx_todo_items_stack_id ON public.todo_items(stack_id);

-- Enable RLS
ALTER TABLE public.todo_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own stacks"
    ON public.todo_stacks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stacks"
    ON public.todo_stacks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stacks"
    ON public.todo_stacks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stacks"
    ON public.todo_stacks FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view items in their stacks"
    ON public.todo_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.todo_stacks
            WHERE id = todo_items.stack_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create items in their stacks"
    ON public.todo_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.todo_stacks
            WHERE id = todo_items.stack_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in their stacks"
    ON public.todo_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.todo_stacks
            WHERE id = todo_items.stack_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items in their stacks"
    ON public.todo_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.todo_stacks
            WHERE id = todo_items.stack_id
            AND user_id = auth.uid()
        )
    );
