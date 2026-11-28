import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { siteStats } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { team, vision, mission, contact } from '@/data/site';

export const metadata: Metadata = { title: 'About us', description: 'Our vision, mission, what we do and how we do it: honest, practical stock-market education for India.' };
export const dynamic = 'force-dynamic';

const whatWeDo = [
  { ic: '🎓', t: 'Long-form courses', d: 'Structured 1–3 hour courses that take you from basics to option Greeks and commodities, one concept at a time.', accent: 'green', href: '/academy' },
  { ic: '⚡', t: '60-second Shorts', d: 'Bite-sized, free lessons for when you only have a minute — perfect for a quick concept refresh.', accent: 'gold', href: '/shorts' },
  { ic: '🔬', t: 'Research explainers', d: 'Plain-language guides to stocks, derivatives, commodities, currency, mutual funds and IPOs.', accent: 'cyan', href: '/research' },
  { ic: '🎙️', t: 'Live webinars & workshops', d: 'Interactive sessions on F&O, technical analysis and risk, with time for your questions.', accent: 'violet', href: '/#live' },
];

const how = [
  { ic: '🧱', t: 'First principles', d: 'Every course starts with the why, then the how, with real Indian-market examples.' },
  { ic: '🪜', t: 'Step-by-step paths', d: 'Beginner, Intermediate and Advanced paths so you always know what to learn next.' },
  { ic: '🎁', t: 'Try before you buy', d: 'Free preview lessons in every course, a fully free starter course and free Shorts.' },
  { ic: '🛡️', t: 'Risk first', d: 'Position sizing, max loss and honest data on retail outcomes come before any strategy.' },
  { ic: '📱', t: 'Learn anywhere', d: 'Secure streaming on any device, with progress that follows you.' },
  { ic: '🙋', t: 'Real support', d: 'Questions answered by people who teach, by email and in live sessions.' },
];

const material = [
  { ic: '🚀', t: 'Free starter course', d: 'Market Basics Starter Kit: 4 free lessons.', href: '/courses/market-basics-starter', cta: 'Start free' },
  { ic: '⚡', t: 'Shorts library', d: 'Free 60-second concept videos.', href: '/shorts', cta: 'Watch' },
  { ic: '🔬', t: 'Segment explainers', d: 'Stocks, F&O, commodity, currency, MF and IPO.', href: '/research', cta: 'Read' },
  { ic: '📄', t: 'Course brochure (PDF)', d: 'All courses, syllabus and pricing in one file.', href: '', cta: 'Coming soon' },
];

const values = [
  { ic: '📖', t: 'Education, never tips', d: 'We teach you how to think about markets. We will never tell you what to buy or sell.', accent: 'green' },
  { ic: '🛡️', t: 'Honest about risk', d: 'Most F&O traders lose money. We say that out loud and teach risk management first.', accent: 'gold' },
  { ic: '🇮🇳', t: 'Built for Indian markets', d: 'Nifty, Bank Nifty, MCX, NSE option chains, Indian tax rules — examples you can actually use.', accent: 'cyan' },
  { ic: '🐢', t: 'Learn at your own pace', d: 'Lifetime access, progress tracking and short lessons that fit around your job and life.', accent: 'pink' },
];

export default async function AboutPage() {
  const [stats, shorts] = await Promise.all([siteStats(), prisma.short.count({ where: { published: true } })]);

  return (
    <>
      <section className="about-hero wrap">
        <span className="kicker">👋 About bulls2bear</span>
        <h1>We turn market noise into <span className="grad-text">market knowledge.</span></h1>
        <p>bulls2bear is an investor-education platform for India. We help everyday investors and aspiring traders understand how markets really work — clearly, practically and without hype.</p>
        <div className="seg-tabs" style={{ justifyContent: 'center', marginTop: 26 }}>
          {[['vision', '🔭 Vision'], ['mission', '🎯 Mission'], ['what-we-do', '🛠️ What we do'], ['how', '🪜 How we do it'], ['material', '📚 Material'], ['contact', '📍 Contact']].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="chip">{l}</a>
          ))}
        </div>
        <div className="about-banner reveal">
          <Image src="/logo-wide.jpg" alt="A bull and a bear face off over a candlestick chart" width={840} height={440} priority />
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 40 }}>
        <div className="stats reveal">
          <div className="stat acc-green"><span className="emoji">🎓</span><b>{stats.courses}</b><span>Courses</span></div>
          <div className="stat acc-gold"><span className="emoji">⚡</span><b>{shorts}</b><span>60-second shorts</span></div>
          <div className="stat acc-cyan"><span className="emoji">⏱</span><b>{stats.hours}h+</b><span>Of video lessons</span></div>
          <div className="stat acc-violet"><span className="emoji">🎁</span><b>{stats.free}</b><span>Free lessons</span></div>
        </div>
      </section>

      <section className="section anchor" id="vision">
        <div className="wrap vm-grid">
          <div className="vm-card acc-green reveal">
            <span className="kicker">🔭 Our vision</span>
            <p className="vm-statement">{vision}</p>
          </div>
          <div className="vm-card acc-gold reveal" id="mission">
            <span className="kicker">🎯 Our mission</span>
            <ul className="vm-list">{mission.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="kicker">📍 Our story</span>
            <h2 className="h2">Why we <em>started.</em></h2>
            <p className="muted" style={{ fontSize: 17, marginTop: 18 }}>
              Millions of Indians opened demat accounts in the last few years — and many learned about the market from tip groups,
              hype videos and expensive mistakes. We started bulls2bear to offer the opposite: calm, structured lessons that explain
              the <i>why</i> behind every concept, so you can make your own informed decisions.
            </p>
            <p className="muted" style={{ fontSize: 17, marginTop: 14 }}>
              The name says it all: markets move from bulls to bears and back again. Our job is to help you understand both.
            </p>
          </div>
          <div className="feature-list reveal">
            {values.map((v) => (
              <div className={`feature acc-${v.accent}`} key={v.t}><div className="ic">{v.ic}</div><div><h4>{v.t}</h4><p>{v.d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section anchor" id="what-we-do">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">🛠️ What we do</span><h2>Four ways to <em>learn with us.</em></h2></div>
            <p>Pick the format that fits your day — from a 60-second short to a full course or a live session.</p>
          </div>
          <div className="steps">
            {whatWeDo.map((w, i) => (
              <Link href={w.href} className={`step acc-${w.accent} reveal`} key={w.t}>
                <div className="ic">{w.ic}</div>
                <span className="n">0{i + 1}</span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
                <p className="link" style={{ marginTop: 14, fontSize: 14 }}>Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt anchor" id="how">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">🪜 How we do it</span><h2>Our teaching <em>method.</em></h2></div>
            <p>Six principles behind every lesson we publish.</p>
          </div>
          <div className="how-grid">
            {how.map((h, i) => (
              <div className={`feature acc-${['green', 'gold', 'cyan', 'violet', 'pink', 'lime'][i]} reveal`} key={h.t}><div className="ic">{h.ic}</div><div><h4>{h.t}</h4><p>{h.d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section anchor" id="material">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">📚 Material</span><h2>Learning <em>material.</em></h2></div>
            <p>Free resources to start with today.</p>
          </div>
          <div className="steps">
            {material.map((m, i) => {
              const inner = (<><div className="ic">{m.ic}</div><h3>{m.t}</h3><p>{m.d}</p><p className={m.href ? 'link' : 'muted'} style={{ marginTop: 14, fontSize: 14 }}>{m.cta}{m.href && ' →'}</p></>);
              const cls = `step acc-${['lime', 'gold', 'cyan', 'violet'][i]} reveal`;
              return m.href ? <Link href={m.href} className={cls} key={m.t}>{inner}</Link> : <div className={cls} key={m.t}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">🤝 The team</span><h2>The people <em>behind it.</em></h2></div>
            <p>Practitioners and educators who have lived through both bull and bear markets.</p>
          </div>
          <div className="team">
            {team.map((m, i) => (
              <div className={`member acc-${m.accent} reveal`} key={i}>
                <span className="avatar">{m.name.replace(/[^A-Za-z]/g, '').charAt(0) || '★'}</span>
                <h3>{m.name}</h3>
                <span className="kicker" style={{ marginTop: 10 }}>{m.role}</span>
                <p>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section anchor" id="contact">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">📍 Contact</span><h2>Reach <em>us.</em></h2></div>
            <p>{contact.hours}</p>
          </div>
          <div className="steps contact-cards">
            <a href={`mailto:${contact.email}`} className="step acc-green"><div className="ic">✉️</div><h3>Email</h3><p>{contact.email}</p></a>
            <a href={contact.phoneHref || '#contact'} className="step acc-gold"><div className="ic">📞</div><h3>Phone number</h3><p>{contact.phone}</p></a>
            <div className="step acc-cyan"><div className="ic">📍</div><h3>Address</h3><p>{contact.address}</p></div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 100 }}>
        <div className="cta-band reveal">
          <h2>Ready to start <span className="grad-text">learning?</span></h2>
          <p>Begin with our free starter course or a 60-second short. No card needed.</p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 0 }}>
            <Link href="/courses/market-basics-starter" className="btn btn-primary btn-lg">🚀 Start the free course</Link>
            <Link href="/support" className="btn btn-ghost btn-lg">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
