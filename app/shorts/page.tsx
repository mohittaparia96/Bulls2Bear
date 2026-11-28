import type { Metadata } from 'next';
import LibraryTabs from '@/components/LibraryTabs';
import ShortsExplorer from '@/components/ShortsExplorer';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Shorts — learn in under a minute', description: 'Free 60-second stock market lessons: basics, charts, F&O, mindset and investing.' };
export const dynamic = 'force-dynamic';

export default async function ShortsPage({ searchParams }: { searchParams: Promise<{ play?: string; cat?: string }> }) {
  const { play, cat } = await searchParams;
  const [shorts, courses] = await Promise.all([
    prisma.short.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.course.findMany({ where: { published: true }, select: { slug: true, title: true } }),
  ]);
  const courseTitles = Object.fromEntries(courses.map((c) => [c.slug, c.title]));
  const data = shorts.map(({ id, slug, title, category, durationSec, emoji, accent, courseSlug }) => ({ id, slug, title, category, durationSec, emoji, accent, courseSlug }));

  return (
    <div className="wrap">
      <div className="page-head">
        <span className="kicker">⚡ Shorts</span>
        <h1>Learn something in <span className="grad-text">under a minute.</span></h1>
        <p>Bite-sized, free lessons. Tap any card to play — swipe or use ↑ ↓ to jump to the next one.</p>
      </div>
      <LibraryTabs active="shorts" courses={courses.length} shorts={shorts.length} />
      <ShortsExplorer shorts={data} initialPlay={play} initialCat={cat} courseTitles={courseTitles} />
    </div>
  );
}
