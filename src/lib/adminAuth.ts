import { cookies } from 'next/headers';

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
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    return token === getExpectedToken();
  } catch {
    return false;
  }
}
