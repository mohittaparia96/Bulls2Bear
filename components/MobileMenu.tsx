'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ links, loggedIn }: { links: { href: string; label: string }[]; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);

  const panel = (
    <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile">
      {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
      {loggedIn ? <Link href="/dashboard">My learning</Link> : <Link href="/login">Log in</Link>}
    </nav>
  );

  return (
    <>
      <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? '✕' : '☰'}</button>
      {mounted && createPortal(panel, document.getElementById('mobile-nav-slot')!)}
    </>
  );
}
