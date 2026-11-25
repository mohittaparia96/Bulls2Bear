import Image from 'next/image';
import type { ReactNode } from 'react';

export default function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <Image src="/logo-wide.jpg" alt="bulls2bear" width={420} height={220} />
        <h2>Trade smart.<br /><span className="grad-text">Learn. Grow.</span></h2>
        <p className="muted" style={{ maxWidth: 420 }}>Join learners across India building real market understanding — one structured lesson at a time.</p>
        <div className="lock-list" style={{ maxWidth: 420 }}>
          <span>Free preview lessons</span><span>Lifetime course access</span><span>Progress on all devices</span><span>Secure Razorpay payments</span>
        </div>
      </div>
      <div className="auth-main">
        <div className="auth-box">
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
