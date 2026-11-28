'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { menu } from '@/data/nav';

export default function MobileMenu({ loggedIn, isAdmin }: { loggedIn: boolean; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);
  const close = () => setOpen(false);

  const panel = (
    <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile">
      <form action="/search" method="get" role="search" className="header-search" onSubmit={close}>
        <span aria-hidden>⌕</span>
        <input name="q" type="search" placeholder="Search courses, shorts, topics…" aria-label="Search" />
      </form>
      {menu.map((s) => (
        <details key={s.key} className="m-sec">
          <summary>{s.label}<span aria-hidden>⌄</span></summary>
          <div className="m-links">
            {s.groups.flatMap((g) => g.items).map((it) => (
              <Link key={it.label + it.href} href={it.href} onClick={close}>
                <span className="mi">{it.icon}</span>{it.label}{it.badge && <em className="new">{it.badge}</em>}
              </Link>
            ))}
          </div>
        </details>
      ))}
      <div className="m-actions">
        {loggedIn ? (
          <>
            {isAdmin && <Link href="/admin" className="btn btn-ghost" onClick={close}>Admin</Link>}
            <Link href="/dashboard" className="btn btn-primary" onClick={close}>My learning →</Link>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost" onClick={close}>Log in</Link>
            <Link href="/signup" className="btn btn-primary" onClick={close}>Sign up free →</Link>
          </>
        )}
      </div>
    </nav>
  );

  return (
    <>
      <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? '✕' : '☰'}</button>
      {mounted && createPortal(panel, document.getElementById('mobile-nav-slot')!)}
    </>
  );
}
