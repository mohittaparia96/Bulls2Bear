import Link from 'next/link';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { listCourses, ownedCourseIds } from '@/lib/queries';
import CourseCard from '@/components/CourseCard';
import { minutes } from '@/lib/format';

export const metadata: Metadata = { title: 'Academy — learning paths', description: 'bulls2bear Beginner, Intermediate and Advanced learning paths: the right courses, in the right order.' };
export const dynamic = 'force-dynamic';

// Edit the order of courses in each path here.
const paths = [
  { key: 'beginner', icon: '🌱', accent: 'green', title: 'bulls2bear Beginner learning', blurb: 'New to markets? Start here. Understand how the market works, open your accounts, invest sensibly and learn the commodity basics.',
    courses: ['market-basics-starter', 'stock-market-foundations', 'mutual-funds-investing', 'commodity-trading-beginner'] },
  { key: 'intermediate', icon: '🚀', accent: 'gold', title: 'bulls2bear Intermediate learning', blurb: 'Comfortable with the basics? Learn to read charts, understand futures & options and build the discipline every trader needs.',
    courses: ['technical-analysis-essentials', 'futures-options-foundations', 'trading-psychology'] },
  { key: 'advanced', icon: '🏆', accent: 'violet', title: 'bulls2bear Advanced learning', blurb: 'Ready for depth? Think in probabilities with option Greeks, manage risk like a professional and trade global commodity drivers.',
    courses: ['options-greeks-risk', 'commodity-trading-advanced'] },
];

export default async function AcademyPage() {
  const user = await getCurrentUser();
  const [all, owned] = await Promise.all([listCourses(), ownedCourseIds(user)]);

  return (
    <>
      <section className="page-head wrap">
        <span className="kicker">🎓 bulls2bear Academy</span>
        <h1>Three paths. <span className="grad-text">One clear direction.</span></h1>
        <p style={{ maxWidth: 680 }}>Not sure where to start? Pick your level and follow the courses in order. Every course has free preview lessons.</p>
        <div className="seg-tabs">
          {paths.map((p) => <a key={p.key} href={`#${p.key}`} className="chip">{p.icon} {p.title.replace('bulls2bear ', '')}</a>)}
          <Link href="/shorts" className="chip">⚡ Shorts</Link>
        </div>
      </section>

      {paths.map((p, pi) => {
        const courses = p.courses.map((slug) => all.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => !!c);
        const secs = courses.reduce((t, c) => t + c.chapters.reduce((a, ch) => a + ch.durationSec, 0), 0);
        return (
          <section key={p.key} id={p.key} className={`section path acc-${p.accent} ${pi % 2 ? 'section-alt' : ''}`} style={{ scrollMarginTop: 80 }}>
            <div className="wrap">
              <div className="section-head">
                <div>
                  <span className="kicker">{p.icon} Level {pi + 1} of 3</span>
                  <h2>{p.title.replace('bulls2bear ', '')}</h2>
                </div>
                <p>{p.blurb}<br /><b style={{ color: 'var(--accent)' }}>{courses.length} courses · {minutes(secs)} of video</b></p>
              </div>
              <div className="course-grid">
                {courses.map((c, i) => (
                  <div key={c.id} className="path-step"><span className="path-n">Step {i + 1}</span><CourseCard course={c} index={i} owned={owned.has(c.id)} /></div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="wrap" style={{ padding: '60px 0 100px' }}>
        <div className="cta-band reveal">
          <h2>Only have a minute? <span className="grad-text">Watch a Short.</span></h2>
          <p>Free 60-second lessons on basics, charts, F&amp;O, mindset and investing.</p>
          <Link href="/shorts" className="btn btn-primary btn-lg">⚡ Browse Shorts</Link>
        </div>
      </section>
    </>
  );
}
