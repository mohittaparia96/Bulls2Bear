'use client';
import { useState, type ReactNode } from 'react';

/** Lesson list on the player page: always visible on desktop, a tap-to-open dropdown on mobile/tablet. */
export default function SideToggle({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`learn-side ${open ? 'open' : ''}`}>
      <button className="side-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>📚 {label}</span><span>⌄</span>
      </button>
      {children}
    </aside>
  );
}
