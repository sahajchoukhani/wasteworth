import { NextRequest } from 'next/server';

interface RateEntry {
  count: number;
  resetAt: number;
}

const BUCKET_MAP = new Map<string, RateEntry>();

export function checkRateLimit(
  req: NextRequest,
  keyPrefix: string,
  maxRequests = 15,
  windowMs = 60_000
): { allowed: boolean; retryAfterSec: number } {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || 'local';
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const existing = BUCKET_MAP.get(key);
  if (!existing || existing.resetAt <= now) {
    BUCKET_MAP.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
