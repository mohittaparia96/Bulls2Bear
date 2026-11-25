import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { badOrigin, json } from '@/lib/security';

const schema = z.object({ chapterId: z.string(), positionSec: z.number().int().min(0).max(36000), completed: z.boolean().optional() });

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req);
  if (blocked) return blocked;
  const user = await getCurrentUser();
  if (!user) return json({ ok: false }, 401);
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ ok: false }, 400);
  const { chapterId, positionSec, completed } = p.data;

  const existing = await prisma.progress.findUnique({ where: { userId_chapterId: { userId: user.id, chapterId } } });
  await prisma.progress.upsert({
    where: { userId_chapterId: { userId: user.id, chapterId } },
    update: { positionSec, completed: completed || existing?.completed || false },
    create: { userId: user.id, chapterId, positionSec, completed: !!completed },
  });
  return json({ ok: true });
}
