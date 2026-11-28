import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { segments } from '@/data/research';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL || 'https://bulls2bear.com';
  const courses = await prisma.course.findMany({ where: { published: true }, select: { slug: true } });
  return [
    '', '/courses', '/shorts', '/academy', '/research', ...segments.map((s) => `/research/${s.slug}`), '/about', '/join', '/support', '/app', '/contact', '/terms', '/privacy', '/refund-policy', '/disclaimer',
    ...courses.map((c) => `/courses/${c.slug}`),
  ].map((p) => ({ url: `${base}${p}` }));
}
