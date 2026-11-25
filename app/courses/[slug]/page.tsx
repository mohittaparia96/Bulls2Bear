import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import { CourseThumb } from '@/components/CourseCard';
import BuyButton from '@/components/BuyButton';
import ShortCard from '@/components/ShortCard';
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
  const isFreeCourse = course.pricePaise === 0;
  const progress = user ? await prisma.progress.findMany({ where: { userId: user.id, chapterId: { in: course.chapters.map((c) => c.id) } } }) : [];
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.chapterId));
  const total = course.chapters.reduce((s, c) => s + c.durationSec, 0);
  const freeCount = course.chapters.filter((c) => c.isFree).length;
  const outcomes: string[] = JSON.parse(course.outcomes);
  const off = discountPct(course.pricePaise, course.mrpPaise);
  const firstFree = course.chapters.find((c) => c.isFree);
  const nextUp = course.chapters.find((c) => !done.has(c.id)) ?? course.chapters[0];
  const [index, related] = await Promise.all([
    prisma.course.findMany({ select: { id: true }, orderBy: { sortOrder: 'asc' } }).then((all) => all.findIndex((c) => c.id === course.id)),
    prisma.short.findMany({ where: { courseSlug: course.slug, published: true }, orderBy: { sortOrder: 'asc' } }),
  ]);
  const canPlay = (isFree: boolean) => owned || isFree;

  return (
    <>
      <section className={`course-hero acc-${course.accent}`}>
        <div className="wrap course-hero-inner">
          <div>
            <div className="crumbs"><Link href="/courses">Courses</Link> / {course.category}</div>
            {purchased && <p className="notice ok" style={{ marginBottom: 20 }}>🎉 Payment successful — you now have lifetime access to this course. A receipt has been emailed to you.</p>}
            <span className="pill accent" style={{ marginBottom: 16 }}>{course.icon} {course.category}</span>
            <h1 style={{ marginTop: 14 }}>{course.title}</h1>
            <p className="subtitle">{course.subtitle}</p>
            <p className="desc">{course.description}</p>
            <div className="course-facts">
              <span>📚 <b>{course.chapters.length}</b> chapters</span>
              <span>⏱ <b>{minutes(total)}</b> of video</span>
              <span>🎯 <b>{course.level}</b></span>
              <span>▶ <b>{isFreeCourse ? 'All' : freeCount}</b> free {isFreeCourse ? 'lessons' : 'previews'}</span>
              <span>👨‍🏫 {course.instructor}</span>
            </div>
          </div>

          <aside className={`buy-card course-card acc-${course.accent}`} style={{ transform: 'none' }}>
            <CourseThumb course={course} seed={index + 3} owned={owned && !isFreeCourse} />
            <div className="buy-body">
              {owned && !isFreeCourse ? (
                <>
                  <p className="green" style={{ fontWeight: 800 }}>✓ You own this course</p>
                  <Link href={`/learn/${course.slug}/${nextUp.slug}`} className="btn btn-primary btn-lg btn-block">{done.size ? 'Continue learning →' : 'Start learning →'}</Link>
                  <div className="bar"><i style={{ width: `${Math.round((done.size / course.chapters.length) * 100)}%` }} /></div>
                  <p className="muted" style={{ fontSize: 13 }}>{done.size} of {course.chapters.length} chapters completed</p>
                </>
              ) : isFreeCourse ? (
                <>
                  <div className="price free-price">FREE</div>
                  <Link href={`/learn/${course.slug}/${nextUp.slug}`} className="btn btn-primary btn-lg btn-block">{done.size ? 'Continue learning →' : '🚀 Start free course'}</Link>
                  <div className="buy-includes">
                    <span>All {course.chapters.length} chapters — no payment needed</span>
                    <span>{user ? 'Progress saved to your account' : 'Sign up free to save your progress'}</span>
                    <span>Watch on mobile, tablet &amp; desktop</span>
                  </div>
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
        <div className="content-section acc-stack">
          {/* Curriculum — each chapter expands to show its summary and a play/unlock action */}
          <details className="acc-block" open>
            <summary>
              <div><h2>📚 Course curriculum</h2><small>{course.chapters.length} chapters · {minutes(total)} total · tap a chapter for details</small></div>
            </summary>
            <div className="acc-body">
              {course.chapters.map((ch, i) => {
                const open = canPlay(ch.isFree);
                return (
                  <details key={ch.id} className={`acc-item ${open ? 'open' : ''}`}>
                    <summary>
                      <span className="num">{done.has(ch.id) ? '✓' : i + 1}</span>
                      <span className="info">{ch.title}<small>⏱ {minutes(ch.durationSec)}</small></span>
                      {done.has(ch.id) ? <span className="state done">Done</span>
                        : ch.isFree && !owned ? <span className="state free">▶ Free</span>
                        : open ? <span className="state free">▶ Play</span>
                        : <span className="state locked">🔒 Locked</span>}
                      <span className="chev" aria-hidden>+</span>
                    </summary>
                    <div className="detail">
                      <span>{ch.summary}</span>
                      {open
                        ? <Link href={`/learn/${course.slug}/${ch.slug}`} className="btn btn-primary btn-sm">▶ Play chapter</Link>
                        : <Link href={`/learn/${course.slug}/${ch.slug}`} className="btn btn-ghost btn-sm">🔒 Unlock to watch</Link>}
                    </div>
                  </details>
                );
              })}
            </div>
          </details>

          <details className="acc-block">
            <summary><div><h2>🎯 What you’ll learn</h2><small>{outcomes.length} key outcomes</small></div></summary>
            <div className="acc-body"><div className="outcomes">{outcomes.map((o) => <span key={o}>{o}</span>)}</div></div>
          </details>

          <details className="acc-block">
            <summary><div><h2>🙋 Who is this for?</h2><small>Is this course right for you?</small></div></summary>
            <div className="acc-body">
              <p className="muted" style={{ maxWidth: 680 }}>
                Retail investors and aspiring traders in India who want a structured, honest understanding of {course.category.toLowerCase()} concepts —
                without stock tips, hype or shortcuts. If you can use a smartphone trading app, you can follow this course.
              </p>
              <p className="notice info" style={{ marginTop: 18, fontSize: 13 }}>Educational content only. Not investment advice. Trading in securities, especially derivatives, involves substantial risk of loss.</p>
            </div>
          </details>

          {related.length > 0 && (
            <section style={{ marginTop: 26 }}>
              <h2 style={{ fontSize: 23, marginBottom: 6 }}>⚡ Quick previews</h2>
              <p className="muted" style={{ marginBottom: 18, fontSize: 14.5 }}>Under-a-minute shorts on topics from this course.</p>
              <div className="shorts-rail">
                {related.map((s) => <ShortCard key={s.id} short={s} href={`/shorts?play=${s.slug}`} />)}
              </div>
            </section>
          )}
        </div>
        <div />
      </div>
    </>
  );
}
