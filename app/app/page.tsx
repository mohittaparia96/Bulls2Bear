import Link from 'next/link';
import type { Metadata } from 'next';
import AjaxForm from '@/components/AjaxForm';

export const metadata: Metadata = { title: 'Mobile app', description: 'The bulls2bear mobile app is coming soon. Learn on the go with courses, shorts and progress sync.' };

const features = [
  { ic: '⚡', t: 'Shorts feed', d: 'Swipe through 60-second lessons like reels.', accent: 'gold' },
  { ic: '🎓', t: 'All your courses', d: 'Pick up exactly where you left off on the web.', accent: 'green' },
  { ic: '🔔', t: 'Webinar reminders', d: 'Never miss a live session.', accent: 'cyan' },
  { ic: '🛡️', t: 'Secure playback', d: 'The same protected streaming as the website.', accent: 'violet' },
];

export default function AppPage() {
  return (
    <section className="section">
      <div className="wrap split" style={{ alignItems: 'center' }}>
        <div>
          <span className="kicker">📱 Mobile application</span>
          <h1 className="h2" style={{ fontSize: 'clamp(38px,5.4vw,64px)' }}>bulls2bear in your <em>pocket.</em></h1>
          <p className="muted" style={{ fontSize: 18, margin: '18px 0 26px', maxWidth: 520 }}>
            Our Android and iOS app is on the way. Leave your email and we&apos;ll tell you the day it launches. Until then, the website works great on your phone.
          </p>
          <AjaxForm endpoint="/api/newsletter" className="newsletter" compact>
            <input className="input" name="email" type="email" required placeholder="you@email.com" aria-label="Email" />
            <button className="btn btn-primary">Notify me</button>
          </AjaxForm>
          <p style={{ marginTop: 18 }}><Link href="/shorts" className="link">Try the Shorts player on the web →</Link></p>
        </div>
        <div className="feature-list">
          {features.map((f) => (
            <div className={`feature acc-${f.accent} reveal`} key={f.t}><div className="ic">{f.ic}</div><div><h4>{f.t}</h4><p>{f.d}</p></div></div>
          ))}
          <p className="pill" style={{ justifySelf: 'start', marginTop: 6 }}>Coming soon</p>
        </div>
      </div>
    </section>
  );
}
