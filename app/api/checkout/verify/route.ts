import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { badOrigin, json } from '@/lib/security';
import { fulfilOrder, verifyCheckoutSignature } from '@/lib/payments';

const schema = z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req);
  if (blocked) return blocked;
  const user = await getCurrentUser();
  if (!user) return json({ error: 'Session expired. Please log in.' }, 401);
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Invalid payment response.' }, 400);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = p.data;
  if (!verifyCheckoutSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return json({ error: 'Payment verification failed. If money was debited, it will be auto-refunded or contact info@bulls2bear.com.' }, 400);
  }
  const order = await prisma.order.findUnique({ where: { razorpayOrderId: razorpay_order_id }, include: { course: true } });
  if (!order || order.userId !== user.id) return json({ error: 'Order not found.' }, 404);

  await fulfilOrder(order.id, razorpay_payment_id);
  return json({ ok: true, redirect: `/courses/${order.course.slug}?purchased=1` });
}
