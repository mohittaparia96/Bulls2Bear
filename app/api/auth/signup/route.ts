import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { sendMail, emailLayout } from '@/lib/mail';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(254),
  phone: z.string().trim().regex(/^[0-9+\-\s]{0,16}$/, 'Invalid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
    .regex(/[A-Za-z]/, 'Password needs a letter').regex(/[0-9]/, 'Password needs a number'),
  newsletter: z.literal('yes').optional(),
});

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'signup', 5);
  if (blocked) return blocked;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? 'Invalid details' }, 400);
  const { name, email, phone, password, newsletter } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return json({ error: 'An account with this email already exists. Please log in.' }, 409);

  const user = await prisma.user.create({ data: { name, email, phone: phone || null, passwordHash: await hashPassword(password) } });
  if (newsletter === 'yes') {
    await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  }
  await createSession(user.id);
  sendMail(email, 'Welcome to bulls2bear', emailLayout(`Welcome, ${name}!`, '<p>Your account is ready. Start with any free preview chapter and explore the academy.</p>'));
  return json({ ok: true }, 201);
}
