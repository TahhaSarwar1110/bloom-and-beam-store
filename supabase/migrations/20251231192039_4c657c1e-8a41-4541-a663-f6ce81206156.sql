-- Add make and model columns to parts table
ALTER TABLE public.parts 
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT;