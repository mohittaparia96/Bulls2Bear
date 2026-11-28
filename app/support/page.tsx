import Link from 'next/link';
import type { Metadata } from 'next';
import { contact } from '@/data/site';
import { faqs } from '@/data/faq';

export const metadata: Metadata = { title: 'Support', description: 'Email, phone and answers to common questions about bulls2bear courses, payments and access.' };

export default function SupportPage() {
  return (
    <>
      <section className="page-head wrap">
        <span className="kicker">🛟 Support centre</span>
        <h1>How can we <span className="grad-text">help you?</span></h1>
        <p style={{ maxWidth: 640 }}>Most questions are answered in the FAQs below. Still stuck? Email or call us and a real person will reply.</p>
      </section>

      <section id="contact" className="wrap" style={{ paddingBottom: 30, scrollMarginTop: 90 }}>
        <div className="steps support-cards">
          <a href={`mailto:${contact.email}`} className="step acc-green">
            <div className="ic">✉️</div><h3>Email us</h3><p>{contact.email}</p>
            <p className="link" style={{ marginTop: 12, fontSize: 14 }}>Write to us →</p>
          </a>
          <a href={contact.phoneHref || '#contact'} className="step acc-gold">
            <div className="ic">📞</div><h3>Call us</h3><p>{contact.phone}</p>
            <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>{contact.hours}</p>
          </a>
          <Link href="/contact" className="step acc-cyan">
            <div className="ic">📝</div><h3>Send a message</h3><p>Course, payment or access issue? Use the form and we&apos;ll reply within one business day.</p>
            <p className="link" style={{ marginTop: 12, fontSize: 14 }}>Open the form →</p>
          </Link>
          <Link href="/forgot-password" className="step acc-violet">
            <div className="ic">🔑</div><h3>Can&apos;t log in?</h3><p>Reset your password in under a minute.</p>
            <p className="link" style={{ marginTop: 12, fontSize: 14 }}>Reset password →</p>
          </Link>
        </div>
      </section>

      <section className="section" id="faq" style={{ scrollMarginTop: 70 }}>
        <div className="wrap">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div><span className="kicker">❓ FAQ&apos;s</span><h2>Quick <em>answers.</em></h2></div>
          </div>
          <div className="faq">
            {faqs.map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
