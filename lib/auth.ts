import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cache } from 'react';
import { prisma } from './prisma';
import { config } from './config';

export const SESSION_COOKIE = 'b2b_session';
const SESSION_DAYS = 30;

export type CurrentUser = { id: string; name: string; email: string; role: string; sessionId: string };

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

/** Creates a DB-backed session, enforces the max-device limit and sets an httpOnly cookie. */
export async function createSession(userId: string) {
  const h = await headers();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  const session = await prisma.session.create({
    data: {
      userId, expiresAt,
      userAgent: h.get('user-agent')?.slice(0, 300) ?? null,
      ip: (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || null,
    },
  });

  // Anti account-sharing: keep only the N most recent sessions.
  const all = await prisma.session.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { id: true } });
  const stale = all.slice(config.maxSessions).map((s) => s.id);
  if (stale.length) await prisma.session.deleteMany({ where: { id: { in: stale } } });

  const token = await new SignJWT({ sid: session.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(config.authSecret());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, config.authSecret());
      await prisma.session.deleteMany({ where: { id: String(payload.sid) } });
    } catch { /* already invalid */ }
  }
  jar.delete(SESSION_COOKIE);
}

/** Returns the logged-in user or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, config.authSecret());
    const session = await prisma.session.findUnique({ where: { id: String(payload.sid) }, include: { user: true } });
    if (!session || session.expiresAt < new Date() || session.userId !== payload.sub) return null;
    if (Date.now() - session.lastSeenAt.getTime() > 5 * 60e3) {
      await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
    }
    const u = session.user;
    return { id: u.id, name: u.name, email: u.email, role: u.role, sessionId: session.id };
  } catch {
    return null;
  }
});

export async function requireUser(next = '/dashboard') {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const user = await requireUser('/admin');
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}

export async function hasCourseAccess(user: CurrentUser | null, courseId: string) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  const e = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } });
  return Boolean(e);
}
