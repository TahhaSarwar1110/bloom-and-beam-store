
-- Add slug column to parts table
ALTER TABLE public.parts ADD COLUMN IF NOT EXISTS slug text;

-- Generate slugs from existing part names
UPDATE public.parts 
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS parts_slug_unique ON public.parts(slug);
