-- PCSing.ai Database Schema (canonical reference)
-- Run migrations in order for a fresh setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE ad_status AS ENUM ('active', 'paused', 'completed');

-- ===========================================
-- BASES
-- ===========================================

CREATE TABLE bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_full TEXT,
  zip_code TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  image_url TEXT,
  population INTEGER,
  militaryonesource_slug TEXT,
  resources JSONB DEFAULT '{}',
  bah_rates JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bases_slug ON bases(slug);
CREATE INDEX idx_bases_branch ON bases(branch);
CREATE INDEX idx_bases_state ON bases(state);

-- ===========================================
-- BASE RESOURCES (on-base / installation)
-- ===========================================

CREATE TABLE base_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_id UUID NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  hours TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_base_resources_base ON base_resources(base_id);
CREATE INDEX idx_base_resources_category ON base_resources(category);

-- ===========================================
-- BASE LOCAL RESOURCES (off-base / nearby)
-- ===========================================

CREATE TABLE base_local_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_id UUID NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  rating NUMERIC,
  place_id TEXT,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_base_local_base ON base_local_resources(base_id);
CREATE INDEX idx_base_local_category ON base_local_resources(category);

-- ===========================================
-- BLOG POSTS
-- ===========================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  status blog_status DEFAULT 'draft',
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC);

-- ===========================================
-- AD ZONES
-- ===========================================

CREATE TABLE ad_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  placement TEXT NOT NULL,
  size TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AD CAMPAIGNS
-- ===========================================

CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advertiser_name TEXT NOT NULL,
  zone_id UUID REFERENCES ad_zones(id) ON DELETE SET NULL,
  creative_url TEXT,
  click_url TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  impressions_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  status ad_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_campaigns_zone ON ad_campaigns(zone_id);

-- ===========================================
-- AD IMPRESSIONS
-- ===========================================

CREATE TABLE ad_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_impressions_campaign ON ad_impressions(campaign_id);
CREATE INDEX idx_ad_impressions_created ON ad_impressions(created_at DESC);

-- ===========================================
-- AI KNOWLEDGE BASE
-- ===========================================

CREATE TABLE ai_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_knowledge_category ON ai_knowledge(category);
CREATE INDEX idx_ai_knowledge_topic ON ai_knowledge(topic);

-- ===========================================
-- SITE SETTINGS
-- ===========================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_local_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read bases" ON bases FOR SELECT USING (true);
CREATE POLICY "Public read base_resources" ON base_resources FOR SELECT USING (true);
CREATE POLICY "Public read base_local_resources" ON base_local_resources FOR SELECT USING (true);
CREATE POLICY "Public read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active ad zones" ON ad_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active campaigns" ON ad_campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Public read ai_knowledge" ON ai_knowledge FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert impressions" ON ad_impressions FOR INSERT WITH CHECK (true);

-- Authenticated users manage all content
CREATE POLICY "Auth users manage bases" ON bases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage base_resources" ON base_resources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage base_local_resources" ON base_local_resources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage ad_zones" ON ad_zones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage ad_campaigns" ON ad_campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage ad_impressions" ON ad_impressions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage ai_knowledge" ON ai_knowledge FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
