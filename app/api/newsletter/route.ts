import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badOrigin, json, rateLimited } from '@/lib/security';

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'newsletter', 5);
  if (blocked) return blocked;
  const p = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Please enter a valid email.' }, 400);
  await prisma.newsletterSubscriber.upsert({ where: { email: p.data.email }, update: {}, create: { email: p.data.email } });
  return json({ message: "Subscribed! Weekly market lessons, straight to your inbox." }, 201);
}
