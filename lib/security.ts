import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { config } from './config';

/** Basic CSRF defence for JSON POST endpoints: the Origin header must match this site. */
export function badOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin');
  if (!origin) return null; // same-origin fetches from some browsers omit Origin on GET; POST from our pages always sends it
  const allowed = new Set([new URL(config.appUrl).origin, req.nextUrl.origin]);
  if (!allowed.has(origin)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  return null;
}

/** Tiny in-memory rate limiter (per server instance). Swap for Upstash/Redis when scaling horizontally. */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimited(req: NextRequest, key: string, limit = 10, windowMs = 60_000): NextResponse | null {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  const id = `${key}:${ip}`;
  const now = Date.now();
  const b = buckets.get(id);
  if (!b || b.reset < now) { buckets.set(id, { count: 1, reset: now + windowMs }); return null; }
  b.count++;
  if (b.count > limit) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
  }
  return null;
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
