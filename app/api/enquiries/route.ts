import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { sendMail, emailLayout } from '@/lib/mail';
import { config } from '@/lib/config';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const schema = z.object({
  name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().or(z.literal('')), interest: z.string().trim().min(2).max(100),
  message: z.string().trim().max(2000).optional().or(z.literal('')), consent: z.union([z.literal('true'), z.literal('on'), z.boolean()]),
});

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'enquiry', 5);
  if (blocked) return blocked;
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Please check the form fields and try again.' }, 400);
  const d = p.data;
  await prisma.enquiry.create({ data: { name: d.name, email: d.email.toLowerCase(), phone: d.phone || null, interest: d.interest, message: d.message || null, consent: true } });
  sendMail(config.contactEmail, `New enquiry: ${d.interest}`, emailLayout('New website enquiry',
    `<p><b>${esc(d.name)}</b> (${esc(d.email)}${d.phone ? `, ${esc(d.phone)}` : ''})</p><p>Interest: ${esc(d.interest)}</p><p>${esc(d.message || '')}</p>`));
  return json({ message: 'Thank you! Our team will get back to you within 24 hours.' }, 201);
}
