'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

export default function AuthForm({ mode, next = '/dashboard', token }: { mode: Mode; next?: string; token?: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const data: Record<string, unknown> = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (mode === 'reset') data.token = token;
    const endpoint = { login: '/api/auth/login', signup: '/api/auth/signup', forgot: '/api/auth/forgot', reset: '/api/auth/reset' }[mode];
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong.');
      if (mode === 'login' || mode === 'signup') { window.location.href = d.role === 'ADMIN' && safeNext === '/dashboard' ? '/admin' : safeNext; return; }
      setMsg({ ok: true, text: d.message });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong.' });
    }
    setBusy(false);
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {mode === 'signup' && (
        <>
          <label className="field">Full name<input name="name" required minLength={2} autoComplete="name" placeholder="Your name" /></label>
          <label className="field">Mobile (optional)<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98xxxxxx" /></label>
        </>
      )}
      {mode !== 'reset' && <label className="field">Email<input name="email" type="email" required autoComplete="email" placeholder="you@email.com" /></label>}
      {mode !== 'forgot' && (
        <label className="field">
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            {mode === 'reset' ? 'New password' : 'Password'}
            {mode === 'login' && <Link href="/forgot-password" className="link" style={{ fontSize: 13 }}>Forgot?</Link>}
          </span>
          <input name="password" type="password" required minLength={mode === 'login' ? 1 : 8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'login' ? '••••••••' : 'Min 8 chars, a letter & a number'} />
        </label>
      )}
      {mode === 'signup' && (
        <label className="check"><input type="checkbox" name="newsletter" value="yes" /> <span>📬 Send me the bulls2bear newsletter: new courses, shorts and webinar invites. Unsubscribe anytime.</span></label>
      )}
      {mode === 'signup' && (
        <label className="check"><input type="checkbox" required /> <span>I agree to the <Link href="/terms" className="link">Terms</Link> and <Link href="/privacy" className="link">Privacy Policy</Link>, and understand this is educational content, not investment advice.</span></label>
      )}
      <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
        {busy ? 'Please wait…' : { login: 'Log in →', signup: 'Create free account →', forgot: 'Send reset link', reset: 'Update password' }[mode]}
      </button>
      {msg && <p className={`notice ${msg.ok ? 'ok' : 'err'}`} role="status">{msg.text}</p>}
    </form>
  );
}
