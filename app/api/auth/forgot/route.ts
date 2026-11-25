import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { sendMail, emailLayout } from '@/lib/mail';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'forgot', 3);
  if (blocked) return blocked;
  const parsed = z.object({ email: z.string().trim().toLowerCase().email() }).safeParse(await req.json().catch(() => ({})));
  const generic = { message: 'If an account exists for that email, a reset link is on its way.' };
  if (!parsed.success) return json(generic);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const raw = crypto.randomBytes(32).toString('hex');
    await prisma.passwordReset.create({
      data: { userId: user.id, tokenHash: crypto.createHash('sha256').update(raw).digest('hex'), expiresAt: new Date(Date.now() + 30 * 60e3) },
    });
    const link = `${config.appUrl}/reset-password?token=${raw}`;
    await sendMail(user.email, 'Reset your bulls2bear password', emailLayout('Reset your password',
      `<p>Click below to choose a new password. This link expires in 30 minutes.</p><p><a href="${link}" style="color:#22c55e">${link}</a></p><p>If you didn't request this, ignore this email.</p>`));
  }
  return json(generic);
}
