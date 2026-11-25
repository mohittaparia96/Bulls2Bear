import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { badOrigin, json } from '@/lib/security';
import { paymentsLive } from '@/lib/config';
import { fulfilOrder } from '@/lib/payments';

/** DEMO ONLY: completes a simulated payment. Permanently disabled once Razorpay keys are configured. */
export async function POST(req: NextRequest) {
  if (paymentsLive()) return json({ error: 'Not available.' }, 404);
  const blocked = badOrigin(req);
  if (blocked) return blocked;
  const user = await getCurrentUser();
  if (!user) return json({ error: 'Please log in.' }, 401);
  const p = z.object({ orderId: z.string() }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Invalid order.' }, 400);

  const order = await prisma.order.findUnique({ where: { id: p.data.orderId }, include: { course: true } });
  if (!order || order.userId !== user.id || order.provider !== 'demo') return json({ error: 'Order not found.' }, 404);
  await fulfilOrder(order.id, `demo_pay_${Date.now()}`);
  return json({ ok: true, redirect: `/courses/${order.course.slug}?purchased=1` });
}
