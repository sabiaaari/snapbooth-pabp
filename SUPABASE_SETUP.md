# Supabase Setup Guide

To resolve the "Error fetching templates" issue, you need to create the `templates` table in your Supabase database. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create the templates table
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  required_photos INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view only their own templates
CREATE POLICY "Users can view their own templates" 
ON public.templates FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own templates
CREATE POLICY "Users can insert their own templates" 
ON public.templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own templates
CREATE POLICY "Users can delete their own templates" 
ON public.templates FOR DELETE 
USING (auth.uid() = user_id);
```

After running this SQL, the application will be able to save and fetch your custom frames correctly.
