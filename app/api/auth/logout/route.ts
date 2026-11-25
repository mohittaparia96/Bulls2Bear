import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import { badOrigin } from '@/lib/security';

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req);
  if (blocked) return blocked;
  await destroySession();
  return NextResponse.redirect(new URL('/', req.url), 303);
}
