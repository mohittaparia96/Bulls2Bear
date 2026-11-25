import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { config, paymentsLive } from '@/lib/config';
import { razorpay } from '@/lib/payments';

export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'checkout', 10);
  if (blocked) return blocked;
  const user = await getCurrentUser();
  if (!user) return json({ error: 'Please log in to continue.', login: true }, 401);

  const parsed = z.object({ courseId: z.string().min(1) }).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: 'Invalid course.' }, 400);
  const course = await prisma.course.findFirst({ where: { id: parsed.data.courseId, published: true } });
  if (!course) return json({ error: 'Course not found.' }, 404);
  if (course.pricePaise <= 0) return json({ error: 'This course is free — just start watching!' }, 400);
  if (await hasCourseAccess(user, course.id)) return json({ error: 'You already own this course.', owned: true }, 409);

  // Price always comes from the database, never from the browser.
  const order = await prisma.order.create({
    data: { userId: user.id, courseId: course.id, amountPaise: course.pricePaise, provider: paymentsLive() ? 'razorpay' : 'demo' },
  });

  if (!paymentsLive()) {
    return json({ mode: 'demo', orderId: order.id, amount: course.pricePaise, courseTitle: course.title });
  }

  const rz = await razorpay().orders.create({
    amount: course.pricePaise, currency: 'INR', receipt: order.id,
    notes: { courseId: course.id, userId: user.id, courseSlug: course.slug },
  });
  await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: rz.id } });

  return json({
    mode: 'razorpay', keyId: config.razorpay.keyId, razorpayOrderId: rz.id, amount: course.pricePaise, currency: 'INR',
    courseTitle: course.title, prefill: { name: user.name, email: user.email },
  });
}
