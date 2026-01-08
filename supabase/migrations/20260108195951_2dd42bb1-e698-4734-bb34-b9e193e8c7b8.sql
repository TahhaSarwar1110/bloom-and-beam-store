-- Create table for home page service cards
CREATE TABLE public.home_service_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL DEFAULT 'Bed',
  color text NOT NULL DEFAULT 'from-primary/20 to-primary/5',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for service card items (subcategories)
CREATE TABLE public.home_service_card_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES public.home_service_cards(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.home_service_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_service_card_items ENABLE ROW LEVEL SECURITY;

-- Policies for home_service_cards
CREATE POLICY "Anyone can view home service cards"
ON public.home_service_cards FOR SELECT
USING (true);

CREATE POLICY "Admins can manage home service cards"
ON public.home_service_cards FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for home_service_card_items
CREATE POLICY "Anyone can view home service card items"
ON public.home_service_card_items FOR SELECT
USING (true);

CREATE POLICY "Admins can manage home service card items"
ON public.home_service_card_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_home_service_cards_updated_at
BEFORE UPDATE ON public.home_service_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_home_service_card_items_updated_at
BEFORE UPDATE ON public.home_service_card_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data: Beds
INSERT INTO public.home_service_cards (id, title, icon, color, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Beds', 'Bed', 'from-primary/20 to-primary/5', 0);

INSERT INTO public.home_service_card_items (card_id, name, slug, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Fully Electric Bed', 'fully-electric-bed', 0),
('11111111-1111-1111-1111-111111111111', 'Semi Electric Bed', 'semi-electric-bed', 1),
('11111111-1111-1111-1111-111111111111', 'Bariatric Bed', 'bariatric-bed', 2),
('11111111-1111-1111-1111-111111111111', 'Burn Bed', 'burn-bed', 3),
('11111111-1111-1111-1111-111111111111', 'Birthing Bed', 'birthing-bed', 4);

-- Insert default data: Stretchers
INSERT INTO public.home_service_cards (id, title, icon, color, sort_order)
VALUES ('22222222-2222-2222-2222-222222222222', 'Stretchers', 'Ambulance', 'from-secondary/20 to-secondary/5', 1);

INSERT INTO public.home_service_card_items (card_id, name, slug, sort_order) VALUES
('22222222-2222-2222-2222-222222222222', 'EMS Stretcher', 'ems-stretcher', 0),
('22222222-2222-2222-2222-222222222222', 'ER Stretcher', 'er-stretcher', 1),
('22222222-2222-2222-2222-222222222222', 'Surgery Stretcher', 'surgery-stretcher', 2),
('22222222-2222-2222-2222-222222222222', 'Bariatric Stretcher', 'bariatric-stretcher', 3),
('22222222-2222-2222-2222-222222222222', 'EVAC Stretcher', 'evac-stretcher', 4),
('22222222-2222-2222-2222-222222222222', 'Eye Surgery Stretcher', 'eye-surgery-stretcher', 5),
('22222222-2222-2222-2222-222222222222', 'Birthing Stretcher', 'birthing-stretcher', 6);

-- Insert default data: Accessories
INSERT INTO public.home_service_cards (id, title, icon, color, sort_order)
VALUES ('33333333-3333-3333-3333-333333333333', 'Accessories', 'Armchair', 'from-accent/40 to-accent/10', 2);

INSERT INTO public.home_service_card_items (card_id, name, slug, sort_order) VALUES
('33333333-3333-3333-3333-333333333333', 'Bed Side Table', 'bedside-table', 0),
('33333333-3333-3333-3333-333333333333', 'Bed Over Table', 'bed-over-table', 1),
('33333333-3333-3333-3333-333333333333', 'Wheel Chair', 'wheelchair', 2),
('33333333-3333-3333-3333-333333333333', 'Patient Recliner', 'patient-recliner', 3);