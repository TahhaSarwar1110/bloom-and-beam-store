-- Add image_urls array column to products table for multiple images
ALTER TABLE public.products 
ADD COLUMN image_urls text[] DEFAULT '{}'::text[];