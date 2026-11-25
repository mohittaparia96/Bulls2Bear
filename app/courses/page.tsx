import Link from 'next/link';
import type { Metadata } from 'next';
import CourseCard from '@/components/CourseCard';
import { getCurrentUser } from '@/lib/auth';
import { listCourses, ownedCourseIds } from '@/lib/queries';

export const metadata: Metadata = { title: 'All courses', description: 'Stock market, technical analysis, F&O, options Greeks, mutual funds and trading psychology courses.' };
export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const user = await getCurrentUser();
  const [courses, owned] = await Promise.all([listCourses(), ownedCourseIds(user)]);
  const cats = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];
  const active = cat && cats.includes(cat) ? cat : 'All';
  const shown = active === 'All' ? courses : courses.filter((c) => c.category === active);

  return (
    <div className="wrap">
      <div className="page-head">
        <span className="kicker">The academy</span>
        <h1 style={{ marginTop: 12 }}>All courses</h1>
        <p>Every course includes free preview chapters. Buy once, learn for life.</p>
      </div>
      <div className="filters">
        {cats.map((c) => (
          <Link key={c} href={c === 'All' ? '/courses' : `/courses?cat=${encodeURIComponent(c)}`} className={`filter ${c === active ? 'active' : ''}`} scroll={false}>{c}</Link>
        ))}
      </div>
      <div className="course-grid" style={{ paddingBottom: 100 }}>
        {shown.map((c, i) => <CourseCard key={c.id} course={c} index={courses.indexOf(c)} owned={owned.has(c.id)} />)}
        {shown.length === 0 && <p className="muted">No courses in this category yet.</p>}
      </div>
    </div>
  );
}
