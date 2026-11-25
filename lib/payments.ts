import 'server-only';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { prisma } from './prisma';
import { config } from './config';
import { sendMail, emailLayout } from './mail';
import { inr } from './format';

let client: Razorpay | null = null;
export function razorpay() {
  if (!client) client = new Razorpay({ key_id: config.razorpay.keyId, key_secret: config.razorpay.keySecret });
  return client;
}

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

/** Verifies the signature Razorpay Checkout returns to the browser. */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto.createHmac('sha256', config.razorpay.keySecret).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqual(expected, signature);
}

/** Verifies the X-Razorpay-Signature header on webhooks (computed over the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  if (!config.razorpay.webhookSecret) return false;
  const expected = crypto.createHmac('sha256', config.razorpay.webhookSecret).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

/** Idempotently marks an order paid and grants course access. Safe to call from both verify + webhook. */
export async function fulfilOrder(orderId: string, paymentId?: string) {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { course: true, user: true } });
    if (!order) throw new Error('Order not found');
    const firstTime = order.status !== 'PAID';
    if (firstTime) {
      await tx.order.update({ where: { id: order.id }, data: { status: 'PAID', paidAt: new Date(), razorpayPaymentId: paymentId ?? order.razorpayPaymentId } });
    }
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      update: {},
      create: { userId: order.userId, courseId: order.courseId, source: 'PURCHASE', orderId: order.id },
    });
    return { order, firstTime };
  });

  if (result.firstTime) {
    const { order } = result;
    await sendMail(order.user.email, `You're enrolled: ${order.course.title}`, emailLayout('Welcome aboard! 🎉', `
      <p>Hi ${order.user.name},</p>
      <p>Your payment of <b>${inr(order.amountPaise)}</b> for <b>${order.course.title}</b> was successful.</p>
      <p>Order ID: ${order.id}${paymentId ? `<br/>Payment ID: ${paymentId}` : ''}</p>
      <p><a href="${config.appUrl}/courses/${order.course.slug}" style="color:#22c55e">Start learning →</a></p>`));
  }
  return result.order;
}
