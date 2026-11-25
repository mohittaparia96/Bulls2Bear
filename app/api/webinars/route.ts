import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badOrigin, json, rateLimited } from '@/lib/security';

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(30).optional().or(z.literal('')), topic: z.string().trim().min(2).max(100) });

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'webinar', 5);
  if (blocked) return blocked;
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Please enter a valid name and email.' }, 400);
  const d = p.data;
  await prisma.webinarRegistration.create({ data: { name: d.name, email: d.email.toLowerCase(), phone: d.phone || null, topic: d.topic } });
  return json({ message: "You're registered! We'll email the joining link before the session." }, 201);
}
