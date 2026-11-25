import Link from 'next/link';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import ShortCard from '@/components/ShortCard';
import AjaxForm from '@/components/AjaxForm';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listCourses, ownedCourseIds, siteStats, firstFreeChapter } from '@/lib/queries';

export const dynamic = 'force-dynamic';

const ticker = [
  ['🚀', 'LEARN THE BASICS'], ['🕯️', 'READ THE CHARTS'], ['⚡', 'UNDERSTAND F&O'], ['🛡️', 'MANAGE YOUR RISK'],
  ['🧠', 'MASTER YOUR MINDSET'], ['🌱', 'INVEST FOR THE LONG RUN'], ['🎁', 'START FREE TODAY'],
];

const faqs = [
  ['Is there anything completely free?', 'Yes! The Market Basics Starter Kit is 100% free, every Short is free, and every paid course has 1–2 free preview chapters. No card needed.'],
  ['What’s the difference between Courses and Shorts?', 'Courses are structured, long-form lessons (1–3 hours) for deep learning. Shorts are under-a-minute vertical videos that explain one idea fast.'],
  ['How long do I get access after buying?', 'Lifetime access to the course you buy — including any new chapters we add later.'],
  ['Can I download the videos?', 'No. To protect our instructors’ work, videos stream securely in your account with a personal watermark. You can watch on any device by logging in.'],
  ['On how many devices can I log in?', 'Up to 2 devices at a time. Logging in on a third device signs out the oldest one.'],
  ['What payment methods do you accept?', 'UPI, debit/credit cards, net banking and popular wallets — all processed securely by Razorpay. We never see or store your card details.'],
  ['Is this investment advice?', 'No. bulls2bear is an education platform. We teach concepts, tools and risk management — we do not give stock tips or personalised recommendations.'],
  ['What if I’m not satisfied?', 'Write to info@bulls2bear.com within 7 days of purchase if you’ve watched less than 25% of the course and we’ll process a refund.'],
];

const quotes = [
  ['Rohan M.', 'Software engineer, Pune', 'I had been “trading” options for a year without understanding theta. The Greeks course genuinely changed how I size positions.', 'green'],
  ['Sneha K.', 'CA student, Jaipur', 'Clear, calm and no hype. The shorts are perfect on my commute, and the foundations course filled in all the gaps.', 'gold'],
  ['Arjun P.', 'Business owner, Indore', 'The chart checklist alone was worth it. I now journal every trade and my mistakes are finally visible to me.', 'violet'],
];

export default async function Home() {
  const user = await getCurrentUser();
  const [courses, owned, stats, free, shorts] = await Promise.all([
    listCourses(), ownedCourseIds(user), siteStats(), firstFreeChapter(),
    prisma.short.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' }, take: 8 }),
  ]);
  const freeHref = free ? `/learn/${free.course.slug}/${free.slug}` : '/courses';
  const freeCourse = courses.find((c) => c.pricePaise === 0);

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <svg className="hero-chart" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden>
          <defs><linearGradient id="hc" x1="0" x2="1"><stop offset="0" stopColor="#22e36b" /><stop offset=".5" stopColor="#b8f34a" /><stop offset="1" stopColor="#ffc83d" /></linearGradient></defs>
          <path d="M0 140 L80 120 L140 130 L220 95 L290 110 L360 70 L430 88 L520 52 L590 66 L680 30 L760 48 L850 20 L930 36 L1020 12 L1110 22 L1200 4" fill="none" stroke="url(#hc)" strokeWidth="3" />
        </svg>
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow"><span className="dot" /> India’s most energetic market academy</span>
            <h1>Learn the market.<br /><em className="grad-text">Before you trade it.</em></h1>
            <p className="lead">Fun, practical video lessons on stock-market basics, charts, futures &amp; options and trading psychology — from 60-second shorts to full courses.</p>
            <div className="hero-actions">
              <Link href="/courses" className="btn btn-primary btn-lg">🎓 Explore courses</Link>
              <Link href="/shorts" className="btn btn-ghost btn-lg">⚡ Watch a 60-sec short</Link>
            </div>
            <div className="hero-trust">
              <span>🎁 {stats.free} free lessons</span>
              <span>♾️ Lifetime access</span>
              <span>💳 UPI &amp; cards via Razorpay</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-banner">
              <Image src="/logo-wide.jpg" alt="bulls2bear — a bull and a bear face off over a candlestick chart" width={840} height={440} priority />
              <span className="live"><i /> LEARNING LIVE</span>
            </div>
            <div className="float-chip chip-1"><span className="ic">📈</span><span><span className="muted">NIFTY 50</span><b className="green">▲ 0.84%</b></span></div>
            <div className="float-chip chip-2"><span className="ic">🏆</span><span><span className="muted">Chapter unlocked</span><b>Option Greeks</b></span></div>
            <div className="float-chip chip-3"><span className="ic">⚡</span><span><span className="muted">New short</span><b>Theta in 42s</b></span></div>
          </div>
        </div>
      </section>

      {/* ───────── TICKER ───────── */}
      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {[...ticker, ...ticker].map(([e, t], i) => <span className="ticker-item" key={i}>{e} {t} <b>✦</b></span>)}
        </div>
      </div>

      {/* ───────── STATS ───────── */}
      <section className="wrap" style={{ paddingTop: 70 }}>
        <div className="stats reveal">
          <div className="stat acc-green"><span className="emoji">🎓</span><b>{stats.courses}</b><span>In-depth courses</span></div>
          <div className="stat acc-gold"><span className="emoji">⚡</span><b>{shorts.length}+</b><span>60-second shorts</span></div>
          <div className="stat acc-cyan"><span className="emoji">⏱</span><b>{stats.hours}h+</b><span>Of focused learning</span></div>
          <div className="stat acc-violet"><span className="emoji">🎁</span><b>{stats.free}</b><span>Free lessons</span></div>
        </div>
      </section>

      {/* ───────── COURSES ───────── */}
      <section className="section" id="academy">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">🎓 Long-form courses</span>
              <h2>Go deep.<br /><em>One concept at a time.</em></h2>
            </div>
            <p>From your first market order to option Greeks — structured courses with free preview chapters in every one.</p>
          </div>
          <div className="course-grid">
            {courses.slice(0, 6).map((c, i) => <CourseCard key={c.id} course={c} index={i} owned={owned.has(c.id)} />)}
          </div>
          <div className="center" style={{ marginTop: 36 }}>
            <Link href="/courses" className="btn btn-ghost btn-lg">Browse &amp; filter all {courses.length} courses →</Link>
          </div>
        </div>
      </section>

      {/* ───────── SHORTS ───────── */}
      <section className="section section-alt" id="shorts">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">⚡ Shorts</span>
              <h2>Got a minute?<br /><em>Learn something.</em></h2>
            </div>
            <p>Under-a-minute vertical lessons. Free for everyone — swipe through them like reels.</p>
          </div>
          <div className="shorts-rail">
            {shorts.map((s) => <ShortCard key={s.id} short={s} href={`/shorts?play=${s.slug}`} />)}
          </div>
          <div style={{ marginTop: 26 }}><Link href="/shorts" className="btn btn-gold">See all shorts →</Link></div>
        </div>
      </section>

      {/* ───────── FREE COURSE CALLOUT ───────── */}
      {freeCourse && (
        <section className="wrap" style={{ paddingTop: 90 }}>
          <div className="cta-band free-callout reveal">
            <span style={{ fontSize: 80 }} aria-hidden>{freeCourse.icon}</span>
            <div>
              <span className="pill free">100% FREE COURSE</span>
              <h2 style={{ marginTop: 12, fontSize: 'clamp(26px,3.4vw,40px)' }}>{freeCourse.title}</h2>
              <p style={{ margin: '10px 0 0', maxWidth: 620 }}>{freeCourse.description}</p>
            </div>
            <Link href={`/courses/${freeCourse.slug}`} className="btn btn-primary btn-lg">Start free →</Link>
          </div>
        </section>
      )}

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">🧭 How it works</span>
              <h2>Start free.<br /><em>Unlock when ready.</em></h2>
            </div>
            <p>No subscriptions, no auto-renewals. Pay once for the course you want and keep it for life.</p>
          </div>
          <div className="steps">
            {[
              ['▶️', 'Watch free lessons', 'Shorts, a full free course, and free chapters in every paid course.', 'green'],
              ['👤', 'Create your account', 'Sign up in 20 seconds. Your progress syncs across every device.', 'gold'],
              ['💳', 'Unlock a course', 'Pay securely via UPI, cards or net banking through Razorpay. Instant access.', 'cyan'],
              ['📈', 'Level up', 'Stream in HD, resume where you left off, track progress and revisit anytime.', 'violet'],
            ].map(([ic, t, d, a], i) => (
              <div className={`step acc-${a} reveal`} key={t}>
                <div className="ic">{ic}</div>
                <span className="n">STEP 0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PLATFORM ───────── */}
      <section className="section section-alt">
        <div className="wrap split">
          <div className="reveal">
            <span className="kicker">✨ Built for serious learners</span>
            <h2 className="h2">A premium learning <em>experience.</em></h2>
            <p className="muted" style={{ fontSize: 17, margin: '18px 0 28px' }}>Everything you need to actually learn — and nothing that distracts you from it.</p>
            <div className="feature-list">
              <div className="feature acc-green"><div className="ic">⏯️</div><div><h4>Resume where you left off</h4><p>Progress is saved automatically on every device.</p></div></div>
              <div className="feature acc-gold"><div className="ic">📊</div><div><h4>Real charts, real examples</h4><p>Lessons built on Indian market data — Nifty, Bank Nifty and F&amp;O chains.</p></div></div>
              <div className="feature acc-violet"><div className="ic">🔐</div><div><h4>Secure, ad-free streaming</h4><p>HD video, protected and personally watermarked for your account.</p></div></div>
            </div>
          </div>
          <div className="security-card reveal">
            <div className="mock-player">
              <Image src="/logo-wide.jpg" alt="" width={840} height={440} />
              <span className="wm">student@email.com · 7F3K2A</span>
              <span className="play">▶</span>
            </div>
            <div className="lock-list">
              <span>Encrypted video streams</span><span>Moving personal watermark</span>
              <span>No download links</span><span>Short-lived signed URLs</span>
              <span>2-device login limit</span><span>Session-bound playback</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── LIVE LEARNING + WEBINAR ───────── */}
      <section className="section" id="live">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="kicker">🎙️ Learn your way</span>
            <h2 className="h2">More than videos.<br /><em>A learning community.</em></h2>
            <div className="feature-list" style={{ marginTop: 28 }}>
              {[
                ['🎬', 'On-demand video lessons', 'Revisit concepts and learn at a pace that works for you.', 'green'],
                ['📐', 'Technical lectures', 'Price action, chart patterns, indicators and market structure.', 'cyan'],
                ['🧑‍🏫', 'Live online classes', 'Interactive sessions with time for questions and discussion.', 'gold'],
                ['🎤', 'Webinars & workshops', 'Focused sessions on market concepts, F&O and risk awareness.', 'pink'],
              ].map(([ic, t, d, a]) => (
                <div className={`feature acc-${a}`} key={t}><div className="ic">{ic}</div><div><h4>{t}</h4><p>{d}</p></div></div>
              ))}
            </div>
          </div>
          <div className="form-card reveal">
            <h3>🎟️ Join the next free webinar</h3>
            <p className="muted" style={{ marginBottom: 22, fontSize: 14.5 }}>Register your interest — we’ll email the schedule and joining link.</p>
            <AjaxForm endpoint="/api/webinars" className="form-grid">
              <label className="field">Your name<input name="name" required minLength={2} placeholder="Full name" /></label>
              <div className="form-row">
                <label className="field">Email<input name="email" type="email" required placeholder="you@email.com" /></label>
                <label className="field">Phone (optional)<input name="phone" type="tel" placeholder="+91" /></label>
              </div>
              <label className="field">Topic you’re interested in
                <select name="topic" defaultValue="Futures & Options">
                  <option>Futures &amp; Options</option><option>Technical analysis</option><option>Stock market basics</option>
                  <option>Risk management</option><option>Trading psychology</option>
                </select>
              </label>
              <button className="btn btn-primary btn-block">Register interest →</button>
            </AjaxForm>
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">💬 Learner stories</span><h2>Clarity over<br /><em>noise.</em></h2></div>
            <p>What learners say after replacing random tips with structured learning. <span style={{ fontSize: 12, color: 'var(--dim)' }}>(Illustrative reviews for preview)</span></p>
          </div>
          <div className="quotes">
            {quotes.map(([n, r, q, a]) => (
              <figure className={`quote acc-${a} reveal`} key={n} style={{ margin: 0 }}>
                <span className="stars">★★★★★</span>
                <p>“{q}”</p>
                <figcaption className="who"><span className="avatar">{n[0]}</span><span><b>{n}</b><small>{r}</small></span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINANCIAL SERVICES (from founders' brief) ───────── */}
      <section className="section" id="services">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">🧭 Beyond courses</span><h2>Make informed<br /><em>financial choices.</em></h2></div>
            <p>Explore financial-services information and request a conversation with our team.</p>
          </div>
          <div className="steps" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              ['🎯', 'Investment learning', 'Understand asset classes, diversification, risk and long-term investing principles.', 'green'],
              ['🗂️', 'Financial planning enquiries', 'Share your requirements and ask about available financial-planning support.', 'gold'],
              ['🧑‍💼', 'Advisory information', 'Request details about advisory services, eligibility, scope and applicable disclosures.', 'cyan'],
            ].map(([ic, t, d, a]) => (
              <Link href="/contact" className={`step acc-${a} reveal`} key={t}>
                <div className="ic">{ic}</div><h3>{t}</h3><p>{d}</p>
                <p className="link" style={{ marginTop: 16, fontSize: 14 }}>Enquire →</p>
              </Link>
            ))}
          </div>
          <p className="notice info" style={{ marginTop: 28 }}>
            <b>Important:</b> bulls2bear does not provide personalised investment recommendations through this website. Advisory, research,
            portfolio management or distribution services, if offered, will be subject to applicable SEBI registrations and disclosures. No returns are guaranteed.
          </p>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="section section-alt" id="faq">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 46 }}>
            <span className="kicker">❓ FAQ</span>
            <h2 className="h2">Questions, <em>answered.</em></h2>
          </div>
          <div className="faq">
            {faqs.map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="wrap" style={{ padding: '90px 0 100px' }}>
        <div className="cta-band reveal">
          <div className="floaters" aria-hidden>
            <span style={{ top: '14%', left: '6%' }}>📈</span><span style={{ top: '62%', left: '10%', animationDelay: '-2s' }}>🐂</span>
            <span style={{ top: '18%', right: '8%', animationDelay: '-3s' }}>🚀</span><span style={{ top: '64%', right: '6%', animationDelay: '-1s' }}>🐻</span>
          </div>
          <h2>Your first lesson is <span className="grad-text">free.</span></h2>
          <p>Watch a short, start the free starter course, or preview any chapter — no card required.</p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 0 }}>
            <Link href={freeCourse ? `/courses/${freeCourse.slug}` : freeHref} className="btn btn-primary btn-lg">🚀 Start learning free</Link>
            <Link href="/shorts" className="btn btn-ghost btn-lg">⚡ Browse shorts</Link>
          </div>
        </div>
      </section>
    </>
  );
}
