import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL || 'https://bulls2bear.com';
  const courses = await prisma.course.findMany({ where: { published: true }, select: { slug: true } });
  return [
    '', '/courses', '/contact', '/terms', '/privacy', '/refund-policy', '/disclaimer',
    ...courses.map((c) => `/courses/${c.slug}`),
  ].map((p) => ({ url: `${base}${p}` }));
}
