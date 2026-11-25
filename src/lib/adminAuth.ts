import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase/server';

export const ADMIN_COOKIE_NAME = 'ww_studio_session';

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE || 'WASTEWORTH2026';
}

export function getExpectedToken(): string {
  const pass = getAdminPasscode();
  return Buffer.from(`ww-atelier:${pass}`).toString('base64');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    // 1. Check Supabase Auth session + admin_users table if Supabase is configured
    if (isSupabaseConfigured()) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll() {},
          },
        }
      );
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const adminDb = getSupabaseAdmin();
        if (adminDb) {
          const { data: adminRow } = await adminDb
            .from('admin_users')
            .select('user_id')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();
          if (adminRow) return true;
        }
      }
    }

    // 2. Fallback / local studio passcode cookie check
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    return token === getExpectedToken();
  } catch {
    return false;
  }
}
