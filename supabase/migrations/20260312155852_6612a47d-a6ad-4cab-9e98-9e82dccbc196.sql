
DO $$
DECLARE
  r RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INT;
BEGIN
  FOR r IN SELECT id, name FROM products WHERE slug IS NULL OR slug = '' LOOP
    base_slug := lower(regexp_replace(regexp_replace(regexp_replace(r.name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'), '-+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    new_slug := base_slug;
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = new_slug AND id != r.id) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    UPDATE products SET slug = new_slug WHERE id = r.id;
  END LOOP;

  FOR r IN SELECT id, name FROM parts WHERE slug IS NULL OR slug = '' LOOP
    base_slug := lower(regexp_replace(regexp_replace(regexp_replace(r.name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'), '-+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    new_slug := base_slug;
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM parts WHERE slug = new_slug AND id != r.id) LOOP
      new_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    UPDATE parts SET slug = new_slug WHERE id = r.id;
  END LOOP;
END $$;
