import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { segments } from '@/data/research';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { listCourses, ownedCourseIds } from '@/lib/queries';
import CourseCard from '@/components/CourseCard';
import AjaxForm from '@/components/AjaxForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const { segment } = await params;
  const s = segments.find((x) => x.slug === segment);
  return s ? { title: `${s.title} research`, description: s.intro } : {};
}

export default async function SegmentPage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  const s = segments.find((x) => x.slug === segment);
  if (!s) notFound();
  const user = await getCurrentUser();
  const [all, owned, shorts] = await Promise.all([
    listCourses(), ownedCourseIds(user),
    s.shortCat ? prisma.short.findMany({ where: { published: true, category: s.shortCat }, orderBy: { sortOrder: 'asc' }, take: 4 }) : Promise.resolve([]),
  ]);
  const courses = s.courses.map((slug) => all.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <>
      <section className={`page-head wrap acc-${s.accent}`}>
        <p className="crumbs"><Link href="/research">Research</Link> / {s.title}</p>
        <span className="kicker">{s.icon} {s.tagline}</span>
        <h1>{s.title} <span className="grad-text">explained.</span></h1>
        <p style={{ maxWidth: 760 }}>{s.intro}</p>
        <div className="seg-tabs">
          {segments.map((x) => <Link key={x.slug} href={`/research/${x.slug}`} className={`chip ${x.slug === s.slug ? 'active' : ''}`}>{x.icon} {x.title}</Link>)}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 30 }}>
        <div className="stats">
          {s.facts.map((f, i) => (
            <div className={`stat fact acc-${['green', 'gold', 'cyan', 'violet'][i % 4]}`} key={f.k}><span>{f.k}</span><b>{f.v}</b></div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 50 }}>
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div>
            <span className="kicker">🧠 Key concepts</span>
            <h2 className="h2" style={{ marginBottom: 24 }}>What you need <em>to know.</em></h2>
            <div className="feature-list">
              {s.concepts.map((c, i) => (
                <div className={`feature acc-${['green', 'gold', 'cyan', 'violet'][i % 4]}`} key={c.t}><div className="ic">{['💡', '📐', '🔍', '⚖️'][i % 4]}</div><div><h4>{c.t}</h4><p>{c.d}</p></div></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="form-card">
              <h3>👀 What to watch</h3>
              <div className="outcomes" style={{ gridTemplateColumns: '1fr', marginTop: 14 }}>
                {s.watch.map((w) => <span key={w}>{w}</span>)}
              </div>
            </div>
            <div className="form-card">
              <h3>📬 Research notes: coming soon</h3>
              <p className="muted" style={{ fontSize: 14.5, margin: '6px 0 16px' }}>Get our weekly {s.title.toLowerCase()} learning notes by email when they launch.</p>
              <AjaxForm endpoint="/api/newsletter" className="newsletter" compact>
                <input className="input" name="email" type="email" required placeholder="you@email.com" aria-label="Email" />
                <button className="btn btn-primary btn-sm">Notify me</button>
              </AjaxForm>
            </div>
          </div>
        </div>
      </section>

      {courses.length > 0 && (
        <section className="section section-alt">
          <div className="wrap">
            <div className="section-head"><div><span className="kicker">🎓 Go deeper</span><h2>Learn {s.title.toLowerCase()} <em>properly.</em></h2></div></div>
            <div className="course-grid">{courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} owned={owned.has(c.id)} />)}</div>
            {shorts.length > 0 && (
              <p style={{ marginTop: 26 }}><Link href={`/shorts?cat=${encodeURIComponent(s.shortCat!)}`} className="link">⚡ Watch {shorts.length}+ free {s.shortCat} shorts →</Link></p>
            )}
          </div>
        </section>
      )}

      <section className="wrap" style={{ padding: '40px 0 90px' }}>
        <p className="draft-flag">ℹ️ This page is for education only. bulls2bear is not a SEBI-registered research analyst or investment adviser, and nothing here is a recommendation to buy or sell any security.</p>
      </section>
    </>
  );
}
