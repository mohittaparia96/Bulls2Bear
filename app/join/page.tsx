import type { Metadata } from 'next';
import { socials } from '@/data/site';
import AjaxForm from '@/components/AjaxForm';

export const metadata: Metadata = { title: 'Join 2 Grow — community', description: 'Follow bulls2bear on LinkedIn, YouTube, Telegram, Instagram, WhatsApp and X, and get our weekly newsletter.' };

const accents = ['violet', 'pink', 'cyan', 'gold', 'green', 'lime'];

export default function JoinPage() {
  return (
    <>
      <section className="page-head wrap">
        <span className="kicker">🤝 Join 2 Grow</span>
        <h1>Learn together. <span className="grad-text">Grow together.</span></h1>
        <p style={{ maxWidth: 660 }}>Free lessons, concept explainers and community updates on the platforms you already use. Education only: no tips, no calls, ever.</p>
      </section>

      <section className="wrap" style={{ paddingBottom: 40 }}>
        <div className="join-grid">
          {socials.map((s, i) => (
            <div id={s.key} key={s.key} className={`join-card acc-${accents[i % accents.length]} reveal`}>
              <span className="join-ic">{s.icon}</span>
              <div style={{ flex: 1 }}>
                <h3>{s.label}</h3>
                <p>{s.blurb}</p>
              </div>
              {s.url
                ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Follow →</a>
                : <span className="pill">Coming soon</span>}
            </div>
          ))}
        </div>
      </section>

      <section id="newsletter" className="wrap" style={{ paddingBottom: 100, scrollMarginTop: 90 }}>
        <div className="cta-band reveal">
          <h2>📬 The bulls2bear <span className="grad-text">newsletter</span></h2>
          <p>One short, practical lesson in your inbox every week, plus new courses, shorts and webinar invites. Unsubscribe anytime.</p>
          <AjaxForm endpoint="/api/newsletter" className="newsletter" compact>
            <input className="input" name="email" type="email" required placeholder="you@email.com" aria-label="Email" style={{ maxWidth: 360 }} />
            <button className="btn btn-primary">Subscribe</button>
          </AjaxForm>
        </div>
      </section>
    </>
  );
}
