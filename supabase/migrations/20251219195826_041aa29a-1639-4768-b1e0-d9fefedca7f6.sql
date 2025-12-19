-- Add SEO fields to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS read_time text DEFAULT '5 min read';

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add category_id to products table (keep category text for now for backward compat)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text;

-- Create parts table
CREATE TABLE IF NOT EXISTS public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  image_urls text[] DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parts"
ON public.parts FOR SELECT
USING (true);

CREATE POLICY "Admins can manage parts"
ON public.parts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  sort_order integer DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published FAQs"
ON public.faqs FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage FAQs"
ON public.faqs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for parts updated_at
CREATE TRIGGER update_parts_updated_at
  BEFORE UPDATE ON public.parts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for faqs updated_at
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for parts images
INSERT INTO storage.buckets (id, name, public) VALUES ('parts-images', 'parts-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for parts-images bucket
CREATE POLICY "Anyone can view parts images"
ON storage.objects FOR SELECT
USING (bucket_id = 'parts-images');

CREATE POLICY "Admins can upload parts images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'parts-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update parts images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'parts-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete parts images"
ON storage.objects FOR DELETE
USING (bucket_id = 'parts-images' AND has_role(auth.uid(), 'admin'::app_role));