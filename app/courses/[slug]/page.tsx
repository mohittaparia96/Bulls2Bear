import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import { CourseThumb } from '@/components/CourseCard';
import BuyButton from '@/components/BuyButton';
import { inr, minutes, discountPct } from '@/lib/format';

export const dynamic = 'force-dynamic';

const getCourse = (slug: string) =>
  prisma.course.findFirst({ where: { slug, published: true }, include: { chapters: { orderBy: { sortOrder: 'asc' } } } });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCourse((await params).slug);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function CoursePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ purchased?: string }> }) {
  const { slug } = await params;
  const { purchased } = await searchParams;
  const course = await getCourse(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const owned = await hasCourseAccess(user, course.id);
  const progress = user ? await prisma.progress.findMany({ where: { userId: user.id, chapterId: { in: course.chapters.map((c) => c.id) } } }) : [];
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.chapterId));
  const total = course.chapters.reduce((s, c) => s + c.durationSec, 0);
  const freeCount = course.chapters.filter((c) => c.isFree).length;
  const outcomes: string[] = JSON.parse(course.outcomes);
  const off = discountPct(course.pricePaise, course.mrpPaise);
  const firstFree = course.chapters.find((c) => c.isFree);
  const nextUp = course.chapters.find((c) => !done.has(c.id)) ?? course.chapters[0];
  const accent = course.accent === 'red' ? 'var(--red)' : course.accent === 'gold' ? 'var(--gold)' : 'var(--green)';
  const index = (await prisma.course.findMany({ select: { id: true }, orderBy: { sortOrder: 'asc' } })).findIndex((c) => c.id === course.id);

  return (
    <>
      <section className="course-hero" style={{ ['--accent' as string]: accent }}>
        <div className="wrap course-hero-inner">
          <div>
            <div className="crumbs"><Link href="/courses">Courses</Link> / {course.category}</div>
            {purchased && <p className="notice ok" style={{ marginBottom: 20 }}>🎉 Payment successful — you now have lifetime access to this course. A receipt has been emailed to you.</p>}
            <h1>{course.title}</h1>
            <p className="subtitle">{course.subtitle}</p>
            <p className="desc">{course.description}</p>
            <div className="course-facts">
              <span>▤ <b>{course.chapters.length}</b> chapters</span>
              <span>◷ <b>{minutes(total)}</b> of video</span>
              <span>◆ <b>{course.level}</b></span>
              <span>▶ <b>{freeCount}</b> free previews</span>
              <span>✎ {course.instructor}</span>
            </div>
          </div>

          <aside className={`buy-card course-card acc-${course.accent}`} style={{ transform: 'none' }}>
            <CourseThumb course={course} seed={index + 3} owned={owned} />
            <div className="buy-body">
              {owned ? (
                <>
                  <p className="green" style={{ fontWeight: 700 }}>✓ You own this course</p>
                  <Link href={`/learn/${course.slug}/${nextUp.slug}`} className="btn btn-primary btn-lg btn-block">{done.size ? 'Continue learning →' : 'Start learning →'}</Link>
                  <div className="bar"><i style={{ width: `${Math.round((done.size / course.chapters.length) * 100)}%` }} /></div>
                  <p className="muted" style={{ fontSize: 13 }}>{done.size} of {course.chapters.length} chapters completed</p>
                </>
              ) : (
                <>
                  <div className="price">{inr(course.pricePaise)}{off > 0 && <><s>{inr(course.mrpPaise)}</s><span className="off">{off}% OFF</span></>}</div>
                  <BuyButton courseId={course.id} courseSlug={course.slug} price={course.pricePaise} loggedIn={!!user} />
                  {firstFree && <Link href={`/learn/${course.slug}/${firstFree.slug}`} className="btn btn-ghost btn-block">▶ Watch free preview</Link>}
                  <div className="buy-includes">
                    <span>Lifetime access to all {course.chapters.length} chapters</span>
                    <span>Future updates to this course included</span>
                    <span>Watch on mobile, tablet &amp; desktop</span>
                    <span>Progress tracking &amp; resume playback</span>
                  </div>
                  <p className="secure-note">🔒 Secure payment by Razorpay · UPI · Cards · Net banking</p>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="wrap course-layout">
        <div>
          <section className="content-section">
            <h2>What you’ll learn</h2>
            <div className="outcomes">{outcomes.map((o) => <span key={o}>{o}</span>)}</div>
          </section>

          <section className="content-section" style={{ paddingTop: 0 }}>
            <h2>Course curriculum</h2>
            <p className="muted" style={{ marginTop: -12, marginBottom: 20 }}>{course.chapters.length} chapters · {minutes(total)} total</p>
            <div className="curriculum">
              {course.chapters.map((ch, i) => {
                const open = owned || ch.isFree;
                const row = (
                  <>
                    <span className="num">{done.has(ch.id) ? '✓' : i + 1}</span>
                    <span className="info"><b>{ch.title}</b><small>{ch.summary}</small></span>
                    <span className="dur">{minutes(ch.durationSec)}</span>
                    {done.has(ch.id) ? <span className="state done">Done</span>
                      : ch.isFree && !owned ? <span className="state free">▶ Free</span>
                      : open ? <span className="state free">▶ Play</span>
                      : <span className="state locked">🔒 Locked</span>}
                  </>
                );
                return open
                  ? <Link key={ch.id} href={`/learn/${course.slug}/${ch.slug}`} className="chapter-row open">{row}</Link>
                  : <div key={ch.id} className="chapter-row">{row}</div>;
              })}
            </div>
          </section>

          <section className="content-section" style={{ paddingTop: 0, paddingBottom: 90 }}>
            <h2>Who is this for?</h2>
            <p className="muted" style={{ maxWidth: 680 }}>
              Retail investors and aspiring traders in India who want a structured, honest understanding of {course.category.toLowerCase()} concepts —
              without stock tips, hype or shortcuts. If you can use a smartphone trading app, you can follow this course.
            </p>
            <p className="notice info" style={{ marginTop: 22, fontSize: 13 }}>Educational content only. Not investment advice. Trading in securities, especially derivatives, involves substantial risk of loss.</p>
          </section>
        </div>
        <div />
      </div>
    </>
  );
}
