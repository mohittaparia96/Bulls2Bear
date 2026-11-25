import 'server-only';
import { prisma } from './prisma';
import type { CurrentUser } from './auth';

export async function listCourses() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: { chapters: { select: { durationSec: true, isFree: true }, orderBy: { sortOrder: 'asc' } } },
  });
}

export async function ownedCourseIds(user: CurrentUser | null): Promise<Set<string>> {
  if (!user) return new Set();
  if (user.role === 'ADMIN') return new Set((await prisma.course.findMany({ select: { id: true } })).map((c) => c.id));
  const e = await prisma.enrollment.findMany({ where: { userId: user.id }, select: { courseId: true } });
  return new Set(e.map((x) => x.courseId));
}

export async function siteStats() {
  const [courses, chapters, free, agg] = await Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.chapter.count(),
    prisma.chapter.count({ where: { isFree: true } }),
    prisma.chapter.aggregate({ _sum: { durationSec: true } }),
  ]);
  return { courses, chapters, free, hours: Math.round((agg._sum.durationSec ?? 0) / 3600) };
}

export async function firstFreeChapter() {
  return prisma.chapter.findFirst({ where: { isFree: true }, orderBy: [{ course: { sortOrder: 'asc' } }, { sortOrder: 'asc' }], include: { course: true } });
}
