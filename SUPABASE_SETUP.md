# WasteWorth — Supabase PostgreSQL & Storage Setup

## 1. Create a Supabase Project
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`.
   This creates:
   - `public.products` (seeded with the 5 launch products: Keychains, Earrings, Rings, Bangles, Vases)
   - `public.customization_requests`
   - `public.decor_enquiries`
   - `public.admin_users` & `public.is_admin()`
   - Row Level Security (RLS) policies on all tables
   - Private Storage bucket `customer-uploads` (max 4 MB, `image/jpeg`, `image/png`, `image/webp`)

## 2. Create an Administrator Account
1. In **Authentication → Users**, create your admin user (email + password).
2. Copy that user's UUID and insert them into `public.admin_users`:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('YOUR_AUTH_USER_UUID', 'admin@wasteworth.in', 'admin');
   ```

## 3. Configure Environment Variables
Copy `.env.example` to `.env.local` (for local dev) and add the same keys in Vercel Project Settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` *(server-only; never exposed to browser)*

## 4. Security Architecture
- All public writes (`POST /api/requests`, `POST /api/decor-enquiries`, `POST /api/uploads`) run on the server with input sanitization, MIME/size checks, and per-IP rate limiting.
- Customer photos are stored in the private `customer-uploads` bucket; only database storage paths are saved, and temporary 5-minute signed URLs are generated exclusively for authenticated admins.
- Public visitors can only read active rows in `public.products`. No public read access exists on `customization_requests` or `decor_enquiries`.
