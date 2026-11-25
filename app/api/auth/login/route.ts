import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';

const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(128) });
// Equalise timing for unknown emails so attackers can't enumerate accounts.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'login', 8);
  if (blocked) return blocked;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: 'Please enter your email and password.' }, 400);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return json({ error: 'Incorrect email or password.' }, 401);

  await createSession(user.id);
  return json({ ok: true, role: user.role });
}
