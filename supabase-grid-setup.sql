-- SQL to create the grid_data table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.grid_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  participants JSONB NOT NULL DEFAULT '[]',
  afc_numbers JSONB NOT NULL DEFAULT '[]',
  nfc_numbers JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE public.grid_data ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read the grid
CREATE POLICY "Everyone can view grid" 
  ON public.grid_data 
  FOR SELECT 
  TO public 
  USING (true);

-- Policy: Anyone can update the grid (you may want to restrict this to admin only)
CREATE POLICY "Anyone can update grid" 
  ON public.grid_data 
  FOR ALL
  TO public 
  USING (true)
  WITH CHECK (true);

-- Insert initial empty grid
INSERT INTO public.grid_data (id, participants, afc_numbers, nfc_numbers)
VALUES (
  1,
  '[]'::jsonb,
  '[0,1,2,3,4,5,6,7,8,9]'::jsonb,
  '[0,1,2,3,4,5,6,7,8,9]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.grid_data;
