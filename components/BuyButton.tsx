'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { inr } from '@/lib/format';

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void } }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const post = async (url: string, body: unknown) => {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: r.ok, status: r.status, data: await r.json() };
};

export default function BuyButton({ courseId, courseSlug, price, loggedIn, label }: { courseId: string; courseSlug: string; price: number; loggedIn: boolean; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [demo, setDemo] = useState<{ orderId: string; amount: number; courseTitle: string } | null>(null);

  async function buy() {
    if (!loggedIn) { router.push(`/signup?next=${encodeURIComponent(`/courses/${courseSlug}?buy=1`)}`); return; }
    setBusy(true); setErr('');
    try {
      const { ok, data } = await post('/api/checkout/create', { courseId });
      if (!ok) { if (data.owned) router.refresh(); throw new Error(data.error); }

      if (data.mode === 'demo') { setBusy(false); setDemo(data); return; }

      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error('Could not load Razorpay. Check your connection and try again.');
      const rzp = new window.Razorpay({
        key: data.keyId, order_id: data.razorpayOrderId, amount: data.amount, currency: data.currency,
        name: 'bulls2bear', description: data.courseTitle, image: '/logo.jpg', prefill: data.prefill,
        theme: { color: '#22e36b' },
        handler: async (resp: Record<string, string>) => {
          setBusy(true);
          const v = await post('/api/checkout/verify', resp);
          if (v.ok) { router.push(v.data.redirect); router.refresh(); } else { setErr(v.data.error); setBusy(false); }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on('payment.failed', () => setErr('Payment failed. No money was taken — please try again.'));
      rzp.open();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  async function completeDemo() {
    if (!demo) return;
    setBusy(true);
    const { ok, data } = await post('/api/checkout/demo-complete', { orderId: demo.orderId });
    if (ok) { setDemo(null); router.push(data.redirect); router.refresh(); } else { setErr(data.error); setBusy(false); }
  }

  return (
    <>
      <button className="btn btn-primary btn-lg btn-block" onClick={buy} disabled={busy}>
        {busy ? 'Processing…' : label ?? `Unlock full course · ${inr(price)}`}
      </button>
      {err && <p className="notice err">{err}</p>}

      {demo && (
        <div className="modal-bg" role="dialog" aria-modal="true" aria-labelledby="demo-pay-title">
          <div className="modal">
            <span className="pill" style={{ color: 'var(--gold)' }}>DEMO MODE</span>
            <h3 id="demo-pay-title" style={{ marginTop: 14 }}>Simulated checkout</h3>
            <p className="muted" style={{ fontSize: 14 }}>Razorpay keys aren’t configured yet, so this simulates a successful payment. With live keys, the real Razorpay window (UPI, cards, net banking) opens here instead.</p>
            <div className="rows">
              <div><span className="muted">Course</span><span>{demo.courseTitle}</span></div>
              <div><span className="muted">Price (incl. GST)</span><span>{inr(demo.amount)}</span></div>
              <div className="total"><span>Total</span><span>{inr(demo.amount)}</span></div>
            </div>
            <button className="btn btn-primary btn-block" onClick={completeDemo} disabled={busy}>{busy ? 'Processing…' : `Simulate payment of ${inr(demo.amount)}`}</button>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => { setDemo(null); setBusy(false); }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
