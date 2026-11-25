import Link from 'next/link';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import AjaxForm from '@/components/AjaxForm';
import { getCurrentUser } from '@/lib/auth';
import { listCourses, ownedCourseIds, siteStats, firstFreeChapter } from '@/lib/queries';

export const dynamic = 'force-dynamic';

const ticker = [
  ['NIFTY 50', '▲ 0.84%', 'up'], ['BANK NIFTY', '▼ 0.21%', 'down'], ['SENSEX', '▲ 0.62%', 'up'], ['INDIA VIX', '▼ 3.10%', 'down'],
  ['LEARN THE BASICS', '✳', 'up'], ['READ THE CHARTS', '✳', 'up'], ['UNDERSTAND F&O', '✳', 'down'], ['MANAGE YOUR RISK', '✳', 'up'],
];

const faqs = [
  ['Which lessons are free?', 'Every course has 1–2 free preview chapters you can watch right now, no payment needed. They help you judge the teaching style before you buy.'],
  ['How long do I get access after buying?', 'Lifetime access to the course you buy — including any new chapters we add to it later.'],
  ['Can I download the videos?', 'No. To protect our instructors’ work, videos stream securely inside your account with DRM and a personal watermark. You can watch on any device by logging in.'],
  ['On how many devices can I log in?', 'Your account can be active on up to 2 devices at a time. Logging in on a third device signs out the oldest one.'],
  ['What payment methods do you accept?', 'UPI, debit/credit cards, net banking and popular wallets — all processed securely by Razorpay. We never see or store your card details.'],
  ['Is this investment advice?', 'No. bulls2bear is an education platform. We teach concepts, tools and risk management — we do not give stock tips or personalised recommendations.'],
  ['What if I’m not satisfied?', 'Write to info@bulls2bear.com within 7 days of purchase if you’ve watched less than 25% of the course and we’ll process a refund. See our refund policy.'],
];

const quotes = [
  ['Rohan M.', 'Software engineer, Pune', 'I had been “trading” options for a year without understanding theta. The Greeks course genuinely changed how I size positions.'],
  ['Sneha K.', 'CA student, Jaipur', 'Clear, calm and no hype. The foundations course explained order types better than any YouTube video I’ve watched.'],
  ['Arjun P.', 'Business owner, Indore', 'The chart checklist alone was worth it. I now journal every trade and my mistakes are finally visible to me.'],
];

export default async function Home() {
  const user = await getCurrentUser();
  const [courses, owned, stats, free] = await Promise.all([listCourses(), ownedCourseIds(user), siteStats(), firstFreeChapter()]);
  const freeHref = free ? `/learn/${free.course.slug}/${free.slug}` : '/courses';

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow"><span className="dot" /> India’s practical market academy</span>
            <h1>Learn the market.<br /><em className="grad-text">Before you trade it.</em></h1>
            <p className="lead">Structured video courses on stock-market basics, technical analysis, futures &amp; options and trading psychology — taught clearly, without hype or tips.</p>
            <div className="hero-actions">
              <Link href="/courses" className="btn btn-primary btn-lg">Explore courses →</Link>
              <Link href={freeHref} className="btn btn-ghost btn-lg">▶ Watch a free lesson</Link>
            </div>
            <div className="hero-trust">
              <span><b>✓</b> {stats.free} free preview lessons</span>
              <span><b>✓</b> Lifetime access</span>
              <span><b>✓</b> UPI &amp; cards via Razorpay</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="logo-orb">
              <Image src="/logo.jpg" alt="bulls2bear logo — bull and bear facing off" width={420} height={420} priority />
              <div className="float-chip chip-1"><span className="muted">NIFTY 50</span><b className="green">▲ 0.84%</b></div>
              <div className="float-chip chip-2"><span className="muted">Chapter unlocked</span><b>Option Greeks ✓</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── TICKER ───────── */}
      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {[...ticker, ...ticker].map(([a, b, c], i) => (
            <span className="ticker-item" key={i}>{a} <span className={c}>{b}</span></span>
          ))}
        </div>
      </div>

      {/* ───────── STATS ───────── */}
      <section className="wrap" style={{ paddingTop: 70 }}>
        <div className="stats reveal">
          <div className="stat"><b>{stats.courses}</b><span>In-depth courses</span></div>
          <div className="stat"><b>{stats.chapters}+</b><span>Video chapters</span></div>
          <div className="stat"><b>{stats.hours}h+</b><span>Of focused learning</span></div>
          <div className="stat"><b className="green">{stats.free}</b><span>Free preview lessons</span></div>
        </div>
      </section>

      {/* ───────── COURSES ───────── */}
      <section className="section" id="academy">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">01 / The academy</span>
              <h2>Learn the market.<br /><em>One concept at a time.</em></h2>
            </div>
            <p>From your first market order to option Greeks — follow a structured learning path. Every course starts with free lessons.</p>
          </div>
          <div className="course-grid">
            {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} owned={owned.has(c.id)} />)}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="section section-alt" id="how">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">02 / How it works</span>
              <h2>Start free.<br /><em>Unlock when ready.</em></h2>
            </div>
            <p>No subscriptions, no auto-renewals. Pay once for the course you want and keep it for life.</p>
          </div>
          <div className="steps">
            {[
              ['▶', 'Watch a free lesson', 'Every course has free intro chapters. No card, no signup needed to preview.'],
              ['◉', 'Create your account', 'Sign up in 20 seconds with your email. Your progress syncs across devices.'],
              ['₹', 'Unlock the full course', 'Pay securely via UPI, cards or net banking through Razorpay. Instant access.'],
              ['↗', 'Learn at your pace', 'Stream every chapter in HD, resume where you left off, revisit anytime.'],
            ].map(([ic, t, d], i) => (
              <div className={`step reveal ${i % 2 ? 'r' : ''}`} key={t}>
                <div className="ic">{ic}</div>
                <span className="n">STEP 0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SECURE PLATFORM ───────── */}
      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <span className="kicker">03 / Built for serious learners</span>
            <h2 style={{ fontSize: 'clamp(32px,4.2vw,50px)', fontWeight: 800, margin: '16px 0 18px' }}>A premium learning<br /><em className="grad-text">experience.</em></h2>
            <p className="muted" style={{ fontSize: 17, marginBottom: 28 }}>Everything you need to actually learn — and nothing that distracts you from it.</p>
            <div className="feature-list">
              <div className="feature"><div className="ic">◷</div><div><h4>Resume where you left off</h4><p>Progress is saved automatically on every device.</p></div></div>
              <div className="feature"><div className="ic">⌁</div><div><h4>Real charts, real examples</h4><p>Lessons built on Indian market data — Nifty, Bank Nifty and F&amp;O chains.</p></div></div>
              <div className="feature"><div className="ic">⛨</div><div><h4>Secure, ad-free streaming</h4><p>HD video, DRM-protected and personally watermarked for your account.</p></div></div>
            </div>
          </div>
          <div className="security-card reveal">
            <div className="mock-player">
              <span className="wm">student@email.com · 7F3K2A</span>
              <span className="play">▶</span>
            </div>
            <div className="lock-list">
              <span>DRM-encrypted streams</span><span>Moving personal watermark</span>
              <span>No download links</span><span>Short-lived signed URLs</span>
              <span>2-device login limit</span><span>Session-bound playback</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── LIVE LEARNING + WEBINAR ───────── */}
      <section className="section section-alt" id="live">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="kicker">04 / Learn your way</span>
            <h2 style={{ fontSize: 'clamp(32px,4.2vw,50px)', fontWeight: 800, margin: '16px 0 18px' }}>More than videos.<br /><em style={{ color: 'var(--red)' }}>A learning community.</em></h2>
            <div className="feature-list" style={{ marginTop: 28 }}>
              {[
                ['On-demand video lessons', 'Revisit concepts and learn at a pace that works for you.'],
                ['Technical lectures', 'Price action, chart patterns, indicators and market structure.'],
                ['Live online classes', 'Interactive sessions with time for questions and discussion.'],
                ['Webinars & workshops', 'Focused sessions on market concepts, F&O and risk awareness.'],
              ].map(([t, d], i) => (
                <div className="feature" key={t}><div className="ic">0{i + 1}</div><div><h4>{t}</h4><p>{d}</p></div></div>
              ))}
            </div>
          </div>
          <div className="form-card reveal">
            <h3>Join the next free webinar</h3>
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
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">05 / Learner stories</span><h2>Clarity over<br /><em>noise.</em></h2></div>
            <p>What learners say after replacing random tips with structured learning. <span style={{ fontSize: 12, color: 'var(--dim)' }}>(Illustrative reviews for preview)</span></p>
          </div>
          <div className="quotes">
            {quotes.map(([n, r, q]) => (
              <figure className="quote reveal" key={n} style={{ margin: 0 }}>
                <span className="stars">★★★★★</span>
                <p>“{q}”</p>
                <figcaption className="who"><span className="avatar">{n[0]}</span><span><b>{n}</b><small>{r}</small></span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINANCIAL SERVICES (from founders' brief) ───────── */}
      <section className="section section-alt" id="services">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">06 / Beyond courses</span><h2>Make informed<br /><em>financial choices.</em></h2></div>
            <p>Explore financial-services information and request a conversation with our team.</p>
          </div>
          <div className="steps" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[
              ['⌖', 'Investment learning', 'Understand asset classes, diversification, risk and long-term investing principles.'],
              ['▤', 'Financial planning enquiries', 'Share your requirements and ask about available financial-planning support.'],
              ['◎', 'Advisory information', 'Request details about advisory services, eligibility, scope and applicable disclosures.'],
            ].map(([ic, t, d], i) => (
              <Link href="/contact" className={`step reveal ${i === 1 ? 'r' : ''}`} key={t}>
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
      <section className="section" id="faq">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 46 }}>
            <span className="kicker">07 / FAQ</span>
            <h2 style={{ fontSize: 'clamp(32px,4.2vw,48px)', fontWeight: 800, marginTop: 14 }}>Questions, answered.</h2>
          </div>
          <div className="faq">
            {faqs.map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="wrap" style={{ paddingBottom: 100 }}>
        <div className="cta-band reveal">
          <h2>Your first lesson is <span className="grad-text">free.</span></h2>
          <p>Watch an introduction chapter right now — no card required. When you’re ready, unlock the full course in one click.</p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 0 }}>
            <Link href={freeHref} className="btn btn-primary btn-lg">▶ Start the free lesson</Link>
            <Link href="/courses" className="btn btn-ghost btn-lg">Browse all courses</Link>
          </div>
        </div>
      </section>
    </>
  );
}
