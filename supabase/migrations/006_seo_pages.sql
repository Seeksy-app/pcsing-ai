CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
