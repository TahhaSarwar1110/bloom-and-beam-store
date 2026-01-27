-- Add condition column to products table for new/used/refurbished status
ALTER TABLE public.products 
ADD COLUMN condition TEXT NOT NULL DEFAULT 'new' 
CHECK (condition IN ('new', 'used', 'refurbished'));