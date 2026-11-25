'use client';
import { useState, type ReactNode, type FormEvent } from 'react';

/** Posts form fields as JSON and shows a success/error notice. */
export default function AjaxForm({ endpoint, children, className, compact }: { endpoint: string; children: ReactNode; className?: string; compact?: boolean }) {
  const [state, setState] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setState(null);
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong.');
      setState({ ok: true, msg: d.message || 'Thank you!' });
      form.reset();
    } catch (err) {
      setState({ ok: false, msg: err instanceof Error ? err.message : 'Something went wrong.' });
    } finally { setBusy(false); }
  }

  return (
    <>
      <form className={className} onSubmit={onSubmit} aria-busy={busy}>
        <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, display: 'contents' }}>{children}</fieldset>
      </form>
      {state && <p className={`notice ${state.ok ? 'ok' : 'err'}`} role="status" style={{ marginTop: compact ? 10 : 16, fontSize: compact ? 13 : 14 }}>{state.msg}</p>}
    </>
  );
}
