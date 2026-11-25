import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { badOrigin, json } from '@/lib/security';

/** Admin: manually grant a student access to a course (e.g. offline payment, scholarship). */
export async function POST(req: NextRequest) {
  const blocked = badOrigin(req);
  if (blocked) return blocked;
  const admin = await getCurrentUser();
  if (admin?.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);
  const p = z.object({ email: z.string().trim().toLowerCase().email(), courseId: z.string() }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Enter a valid email and course.' }, 400);
  const user = await prisma.user.findUnique({ where: { email: p.data.email } });
  if (!user) return json({ error: 'No student with that email. Ask them to sign up first.' }, 404);
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: p.data.courseId } },
    update: {}, create: { userId: user.id, courseId: p.data.courseId, source: 'ADMIN_GRANT' },
  });
  return json({ message: `Access granted to ${user.email}.` });
}
