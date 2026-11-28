import Link from 'next/link';
import type { Metadata } from 'next';
import { segments } from '@/data/research';

export const metadata: Metadata = { title: 'Research', description: 'Plain-language explainers for stocks, derivatives, commodities, currency, mutual funds and IPOs.' };

export default function ResearchPage() {
  return (
    <>
      <section className="page-head wrap">
        <span className="kicker">🔬 Research hub</span>
        <h1>Understand every <span className="grad-text">market segment.</span></h1>
        <p style={{ maxWidth: 680 }}>Six segments, explained in plain language: how each market works, the concepts that matter and what to keep an eye on.</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 60 }}>
        <div className="steps seg-grid">
          {segments.map((s) => (
            <Link href={`/research/${s.slug}`} className={`step acc-${s.accent} reveal`} key={s.slug}>
              <div className="ic">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.tagline}</p>
              <p className="link" style={{ marginTop: 14, fontSize: 14 }}>Explore →</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 90 }}>
        <p className="draft-flag">ℹ️ Educational content only. bulls2bear is not a SEBI-registered research analyst or investment adviser, and nothing here is a recommendation to buy or sell any security.</p>
      </section>
    </>
  );
}
