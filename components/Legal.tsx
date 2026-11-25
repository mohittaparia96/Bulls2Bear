import type { ReactNode } from 'react';

export default function Legal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="wrap legal">
      <span className="kicker">Legal</span>
      <h1 style={{ marginTop: 12 }}>{title}</h1>
      <p className="updated">Last updated: 25 November 2026</p>
      <p className="draft-flag">Draft template for preview — have this reviewed by a lawyer and fill in the registered business details before launch.</p>
      {children}
      <h2>Contact</h2>
      <p>Questions? Email <a className="link" href="mailto:info@bulls2bear.com">info@bulls2bear.com</a>. Grievance Officer: [Name], bulls2bear, [Registered address], India.</p>
    </article>
  );
}
