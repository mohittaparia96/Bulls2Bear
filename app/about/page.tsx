import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { siteStats } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { team } from '@/data/site';

export const metadata: Metadata = { title: 'About us', description: 'Who we are and what we do: honest, practical stock-market education for India.' };
export const dynamic = 'force-dynamic';

const whatWeDo = [
  { ic: '🎓', t: 'Long-form courses', d: 'Structured 1–3 hour courses that take you from basics to option Greeks, one concept at a time.', accent: 'green', href: '/courses' },
  { ic: '⚡', t: '60-second Shorts', d: 'Bite-sized, free lessons for when you only have a minute — perfect for a quick concept refresh.', accent: 'gold', href: '/shorts' },
  { ic: '🎙️', t: 'Live webinars & workshops', d: 'Interactive sessions on F&O, technical analysis and risk, with time for your questions.', accent: 'cyan', href: '/#live' },
  { ic: '🧭', t: 'Financial-services information', d: 'Guidance on where to find appropriately registered advisers and planning support.', accent: 'violet', href: '/contact' },
];

const values = [
  { ic: '📖', t: 'Education, never tips', d: 'We teach you how to think about markets. We will never tell you what to buy or sell.', accent: 'green' },
  { ic: '🛡️', t: 'Honest about risk', d: 'Most F&O traders lose money. We say that out loud and teach risk management first.', accent: 'gold' },
  { ic: '🇮🇳', t: 'Built for Indian markets', d: 'Nifty, Bank Nifty, NSE option chains, Indian tax rules — examples you can actually use.', accent: 'cyan' },
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

      <section className="section">
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

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div><span className="kicker">🚀 What we do</span><h2>Four ways to <em>learn with us.</em></h2></div>
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

      <section className="section">
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

      <section className="wrap" style={{ paddingBottom: 100 }}>
        <div className="cta-band reveal">
          <h2>Ready to start <span className="grad-text">learning?</span></h2>
          <p>Begin with our free starter course or a 60-second short. No card needed.</p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 0 }}>
            <Link href="/courses/market-basics-starter" className="btn btn-primary btn-lg">🚀 Start the free course</Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
