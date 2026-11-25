'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

type L = { href: string; label: string; badge?: string };

export default function MobileMenu({ links, loggedIn, isAdmin }: { links: L[]; loggedIn: boolean; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);

  const panel = (
    <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile">
      {links.map((l) => (
        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
          {l.label}{l.badge && <span className="new" style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, background: 'var(--lime)', color: '#04130a', padding: '2px 6px', borderRadius: 6 }}>{l.badge}</span>}
        </Link>
      ))}
      {loggedIn ? (
        <>
          {isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
          <Link href="/dashboard" className="btn btn-primary" onClick={() => setOpen(false)}>My learning →</Link>
        </>
      ) : (
        <>
          <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
          <Link href="/signup" className="btn btn-primary" onClick={() => setOpen(false)}>Start free →</Link>
        </>
      )}
    </nav>
  );

  return (
    <>
      <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? '✕' : '☰'}</button>
      {mounted && createPortal(panel, document.getElementById('mobile-nav-slot')!)}
    </>
  );
}
