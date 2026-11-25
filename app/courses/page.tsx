import type { Metadata } from 'next';
import CourseExplorer from '@/components/CourseExplorer';
import LibraryTabs from '@/components/LibraryTabs';
import { getCurrentUser } from '@/lib/auth';
import { listCourses, ownedCourseIds } from '@/lib/queries';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Video library — courses', description: 'Long-form stock market courses: basics, technical analysis, F&O, options Greeks, mutual funds and trading psychology.' };
export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const [courses, owned, shortsCount] = await Promise.all([listCourses(), ownedCourseIds(user), prisma.short.count({ where: { published: true } })]);

  const data = courses.map((c, index) => ({
    id: c.id, slug: c.slug, title: c.title, description: c.description, category: c.category, level: c.level, icon: c.icon,
    accent: c.accent, pricePaise: c.pricePaise, mrpPaise: c.mrpPaise, chapters: c.chapters, owned: owned.has(c.id), index,
  }));

  return (
    <div className="wrap">
      <div className="page-head">
        <span className="kicker">📚 Video library</span>
        <h1>Learn at your pace.</h1>
        <p>Deep-dive courses for serious learning, or bite-sized shorts when you have a minute.</p>
      </div>
      <LibraryTabs active="courses" courses={courses.length} shorts={shortsCount} />
      <CourseExplorer
        courses={data}
        initial={{ q: sp.q ?? '', cat: sp.cat ?? 'All', price: sp.price ?? 'all', level: sp.level ?? 'all', sort: sp.sort ?? 'recommended' }}
      />
    </div>
  );
}
