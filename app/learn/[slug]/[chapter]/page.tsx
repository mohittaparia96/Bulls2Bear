import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import SecurePlayer from '@/components/SecurePlayer';
import BuyButton from '@/components/BuyButton';
import { minutes } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false } };

export default async function LearnPage({ params }: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter: chSlug } = await params;
  const course = await prisma.course.findFirst({ where: { slug, published: true }, include: { chapters: { orderBy: { sortOrder: 'asc' } } } });
  if (!course) notFound();
  const idx = course.chapters.findIndex((c) => c.slug === chSlug);
  if (idx < 0) notFound();
  const chapter = course.chapters[idx];

  const user = await getCurrentUser();
  const owned = await hasCourseAccess(user, course.id);
  const canWatch = chapter.isFree || owned;
  const progress = user ? await prisma.progress.findMany({ where: { userId: user.id, chapterId: { in: course.chapters.map((c) => c.id) } } }) : [];
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.chapterId));
  const resumeAt = progress.find((p) => p.chapterId === chapter.id)?.positionSec ?? 0;

  const prev = course.chapters[idx - 1];
  const next = course.chapters[idx + 1];
  const href = (s: string) => `/learn/${course.slug}/${s}`;
  const nextOpen = next && (next.isFree || owned);
  const pct = Math.round((done.size / course.chapters.length) * 100);

  return (
    <div className="learn">
      <div className="learn-main">
        <div className="crumbs"><Link href="/courses">Courses</Link> / <Link href={`/courses/${course.slug}`}>{course.title}</Link> / Chapter {idx + 1}</div>
        <SecurePlayer
          chapterId={chapter.id} locked={!canWatch} loggedIn={!!user} courseSlug={course.slug}
          nextHref={nextOpen ? href(next.slug) : undefined} resumeAt={resumeAt} trackProgress={!!user}
        />
        <div className="lesson-head">
          <div>
            <span className="kicker">{chapter.isFree ? 'Free preview' : 'Premium lesson'} · {minutes(chapter.durationSec)}</span>
            <h1 style={{ marginTop: 8 }}>{chapter.title}</h1>
            <p className="muted" style={{ marginTop: 8 }}>{chapter.summary}</p>
          </div>
          <div className="lesson-nav">
            {prev && <Link href={href(prev.slug)} className="btn btn-ghost btn-sm">← Previous</Link>}
            {next && <Link href={href(next.slug)} className="btn btn-primary btn-sm">Next →</Link>}
          </div>
        </div>
        <div className="shield-strip">
          <span>🔒 Encrypted stream</span><span>◉ Personal watermark</span><span>⛔ Downloads disabled</span><span>⏱ Auto-expiring link</span>
        </div>
        {!owned && (
          <div className="form-card" style={{ marginTop: 30, display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <h3>Enjoying the preview?</h3>
              <p className="muted" style={{ fontSize: 14.5 }}>Unlock all {course.chapters.length} chapters of <b>{course.title}</b> with lifetime access.</p>
            </div>
            <div style={{ minWidth: 280 }}><BuyButton courseId={course.id} courseSlug={course.slug} price={course.pricePaise} loggedIn={!!user} /></div>
          </div>
        )}
      </div>

      <aside className="learn-side">
        <h3>{course.title}</h3>
        <div className="progress-line">
          {owned ? <>{done.size}/{course.chapters.length} completed · {pct}%<div className="bar"><i style={{ width: `${pct}%` }} /></div></> : 'Preview mode — free chapters are unlocked'}
        </div>
        {course.chapters.map((c, i) => {
          const open = c.isFree || owned;
          const cls = `side-ch ${c.id === chapter.id ? 'current' : ''} ${done.has(c.id) ? 'done' : ''} ${open ? '' : 'locked'}`;
          const inner = (
            <>
              <span className="ic">{done.has(c.id) ? '✓' : open ? (c.id === chapter.id ? '▶' : i + 1) : '🔒'}</span>
              <span><b style={{ fontWeight: 600 }}>{c.title}</b><small>{minutes(c.durationSec)}{c.isFree && !owned ? ' · Free' : ''}</small></span>
            </>
          );
          return open ? <Link key={c.id} href={href(c.slug)} className={cls}>{inner}</Link> : <div key={c.id} className={cls}>{inner}</div>;
        })}
      </aside>
    </div>
  );
}
