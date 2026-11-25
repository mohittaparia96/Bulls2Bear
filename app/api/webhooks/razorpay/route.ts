import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fulfilOrder, verifyWebhookSignature } from '@/lib/payments';

/**
 * Razorpay webhook — the source of truth if the buyer closes the tab before the browser callback runs.
 * Dashboard → Settings → Webhooks → URL: https://bulls2bear.com/api/webhooks/razorpay
 * Events: payment.captured, order.paid. Secret → RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') ?? '';
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: 'bad signature' }, { status: 400 });

  const event = JSON.parse(raw) as {
    event: string;
    payload: { payment?: { entity: { id: string; order_id: string; status: string } }; order?: { entity: { id: string } } };
  };

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const rzOrderId = event.payload.payment?.entity.order_id ?? event.payload.order?.entity.id;
    const paymentId = event.payload.payment?.entity.id;
    if (rzOrderId) {
      const order = await prisma.order.findUnique({ where: { razorpayOrderId: rzOrderId } });
      if (order) await fulfilOrder(order.id, paymentId);
    }
  } else if (event.event === 'payment.failed') {
    const rzOrderId = event.payload.payment?.entity.order_id;
    if (rzOrderId) await prisma.order.updateMany({ where: { razorpayOrderId: rzOrderId, status: 'CREATED' }, data: { status: 'FAILED' } });
  }
  return NextResponse.json({ ok: true });
}
