-- Add new columns to parts table for condition, part_no, asset_no, and oem_no
ALTER TABLE public.parts 
ADD COLUMN IF NOT EXISTS condition TEXT NOT NULL DEFAULT 'new',
ADD COLUMN IF NOT EXISTS part_no TEXT,
ADD COLUMN IF NOT EXISTS asset_no TEXT,
ADD COLUMN IF NOT EXISTS oem_no TEXT;

-- Add check constraint for condition values
ALTER TABLE public.parts 
ADD CONSTRAINT parts_condition_check CHECK (condition IN ('new', 'used', 'refurbished'));