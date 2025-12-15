-- Create site_settings table for managing homepage content
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (needed for frontend)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero settings
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{
  "badge": "Trusted by 500+ Healthcare Facilities",
  "title_line1": "Premium Medical",
  "title_line2": "Equipment",
  "title_line3": "Modern Healthcare",
  "description": "Industry-leading hospital stretchers and transport equipment. Engineered for patient comfort, built for healthcare professionals.",
  "hero_image_url": "",
  "stats": [
    {"value": "25+", "label": "Years Experience"},
    {"value": "10K+", "label": "Units Sold"},
    {"value": "98%", "label": "Satisfaction"}
  ],
  "trust_badges": [
    {"icon": "CheckCircle", "text": "5-Year Warranty"},
    {"icon": "Truck", "text": "Free Shipping"},
    {"icon": "Shield", "text": "FDA Approved"}
  ]
}'::jsonb),
('testimonials', '{
  "items": [
    {"name": "Dr. Sarah Johnson", "role": "Chief Medical Officer", "organization": "Metro General Hospital", "quote": "BEDMED has transformed our patient transport efficiency. The quality is unmatched.", "image_url": ""},
    {"name": "James Mitchell", "role": "Procurement Director", "organization": "Regional Healthcare Network", "quote": "Reliable equipment, excellent support. Our go-to supplier for medical equipment.", "image_url": ""},
    {"name": "Dr. Emily Chen", "role": "Emergency Department Head", "organization": "City Medical Center", "quote": "The stretchers are durable and comfortable. Our staff and patients love them.", "image_url": ""}
  ]
}'::jsonb),
('partners', '{
  "items": [
    {"name": "Partner 1", "logo_url": ""},
    {"name": "Partner 2", "logo_url": ""},
    {"name": "Partner 3", "logo_url": ""}
  ]
}'::jsonb);

-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site-images bucket
CREATE POLICY "Anyone can view site images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));