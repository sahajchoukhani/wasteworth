-- WasteWorth Initial Database Schema, RLS Policies, Storage & Seed Data
-- Run this migration in your Supabase SQL Editor or via `supabase db push`

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admin Users Table (server-verified role; never trust frontend-supplied roles)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Products Table (5 launch categories: Keychains, Earrings, Rings, Bangles, Vases)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Keychains', 'Earrings', 'Rings', 'Bangles', 'Vases')),
  material TEXT NOT NULL,
  indicative_price TEXT NOT NULL,
  image_url TEXT NOT NULL,
  customization_available TEXT[] NOT NULL DEFAULT '{}',
  is_concept_render BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Customer Customization Requests Table
CREATE TABLE IF NOT EXISTS public.customization_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  material_types TEXT[] NOT NULL DEFAULT '{}',
  custom_material TEXT NOT NULL DEFAULT '',
  product_category TEXT NOT NULL,
  colour_preference TEXT NOT NULL DEFAULT '',
  design_style TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '',
  pattern TEXT NOT NULL DEFAULT '',
  personalization_text TEXT NOT NULL DEFAULT '',
  special_instructions TEXT NOT NULL DEFAULT '',
  uploaded_image_paths TEXT[] NOT NULL DEFAULT '{}',
  logo_path TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'IN_PRODUCTION', 'COMPLETED')
  ),
  admin_notes TEXT NOT NULL DEFAULT '',
  estimated_price NUMERIC(10, 2),
  final_quoted_price NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Décor Enquiries Table (WasteWorth Form B2B / Institutional)
CREATE TABLE IF NOT EXISTS public.decor_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  product_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  logo_path TEXT,
  colour_preferences TEXT NOT NULL DEFAULT '',
  design_preferences TEXT NOT NULL DEFAULT '',
  budget_range TEXT NOT NULL DEFAULT '',
  special_instructions TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'IN_PRODUCTION', 'COMPLETED')
  ),
  admin_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast admin filtering & reference search
CREATE INDEX IF NOT EXISTS idx_requests_ref ON public.customization_requests (reference_number);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.customization_requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.customization_requests (product_category);
CREATE INDEX IF NOT EXISTS idx_decor_ref ON public.decor_enquiries (reference_number);
CREATE INDEX IF NOT EXISTS idx_decor_status ON public.decor_enquiries (status);
CREATE INDEX IF NOT EXISTS idx_products_active_order ON public.products (is_active, display_order);

-- Enable Row Level Security on ALL tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decor_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: admin_users
DROP POLICY IF EXISTS "Admins can read own record" ON public.admin_users;
CREATE POLICY "Admins can read own record"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies: products (public sees active products only; admins manage all)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policies: customization_requests (NO public read; admin-only read/update)
DROP POLICY IF EXISTS "Admins can view all customization requests" ON public.customization_requests;
CREATE POLICY "Admins can view all customization requests"
  ON public.customization_requests FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update customization requests" ON public.customization_requests;
CREATE POLICY "Admins can update customization requests"
  ON public.customization_requests FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policies: decor_enquiries (NO public read; admin-only read/update)
DROP POLICY IF EXISTS "Admins can view all decor enquiries" ON public.decor_enquiries;
CREATE POLICY "Admins can view all decor enquiries"
  ON public.decor_enquiries FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update decor enquiries" ON public.decor_enquiries;
CREATE POLICY "Admins can update decor enquiries"
  ON public.decor_enquiries FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Private Supabase Storage Bucket for Customer Material Photos & Logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-uploads',
  'customer-uploads',
  FALSE,
  4194304,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins can read customer uploads" ON storage.objects;
CREATE POLICY "Admins can read customer uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'customer-uploads' AND public.is_admin());

-- 6. Seed Launch Collection (5 Core Products)
INSERT INTO public.products (
  name, slug, description, category, material, indicative_price,
  image_url, customization_available, is_concept_render, is_active, display_order
) VALUES
(
  'Bottle-Cap Mosaic Keychain',
  'bottle-cap-mosaic-keychain',
  'Pocket-sized marbled fob pressed from sorted HDPE bottle caps and fitted with a solid brass split-ring.',
  'Keychains',
  'Upcycled HDPE bottle caps & reclaimed brass hardware',
  'From ₹450 (indicative)',
  '/images/real/product-keychain.jpg',
  ARRAY['Bottle-cap colour mix', 'Stamped initials', 'Clasp finish'],
  FALSE,
  TRUE,
  1
),
(
  'Clarified PET Drop Earrings',
  'clarified-pet-drop-earrings',
  'Featherlight hand-cut earrings shaped from discarded beverage bottles and suspended on hypoallergenic brass hooks.',
  'Earrings',
  'Post-consumer PET bottles & hypoallergenic brass wire',
  'From ₹620 (indicative)',
  '/images/real/product-earrings.jpg',
  ARRAY['Polymer tint', 'Drop silhouette', 'Hook metal'],
  FALSE,
  TRUE,
  2
),
(
  'Pressed Polymer Signet Ring',
  'pressed-polymer-signet-ring',
  'Hand-pressed ring formed from layered ocean-teal plastic caps and containers, sanded to a satin mineral finish.',
  'Rings',
  'Upcycled HDPE bottle caps & container lids',
  'From ₹750 (indicative)',
  '/images/real/product-ring.jpg',
  ARRAY['Ring size (US 5–11)', 'Swirl palette', 'Inner band engraving'],
  FALSE,
  TRUE,
  3
),
(
  'Layered Polymer Cuff Bangle',
  'layered-polymer-cuff-bangle',
  'Sculpted open cuff blending swirled packaging polymers with a brushed aluminium core for everyday resilience.',
  'Bangles',
  'Recycled PP containers & crushed aluminium can core',
  'From ₹1,100 (indicative)',
  '/images/real/product-bangle.jpg',
  ARRAY['Wrist circumference', 'Cuff width', 'Inner inscription'],
  FALSE,
  TRUE,
  4
),
(
  'Reclaimed Vessel & Planter Vase',
  'reclaimed-vessel-planter-vase',
  'Small decorative vase and tabletop planter cast from shredded plastic packaging and stabilized mineral filler.',
  'Vases',
  'Shredded plastic packaging & reclaimed polymer composite',
  'From ₹1,450 (indicative)',
  '/images/real/product-vase.jpg',
  ARRAY['Vessel height', 'Speckle palette', 'Matte or satin seal'],
  FALSE,
  TRUE,
  5
)
ON CONFLICT (slug) DO NOTHING;
