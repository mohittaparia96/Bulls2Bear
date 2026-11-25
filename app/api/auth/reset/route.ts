import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';

const schema = z.object({
  token: z.string().length(64),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
    .regex(/[A-Za-z]/, 'Password needs a letter').regex(/[0-9]/, 'Password needs a number'),
});

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'reset', 5);
  if (blocked) return blocked;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, 400);

  const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash } });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) return json({ error: 'This reset link is invalid or has expired.' }, 400);

  await prisma.$transaction([
    prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: reset.userId } }), // log out everywhere
  ]);
  return json({ message: 'Password updated. Please log in with your new password.' });
}
