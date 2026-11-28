'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { menu } from '@/data/nav';

export default function MegaNav() {
  const [open, setOpen] = useState<string | null>(null);
  const path = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => setOpen(null), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const enter = (k: string) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(k), 60); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 160); };

  return (
    <nav className="nav" aria-label="Main" onMouseLeave={leave}>
      {menu.map((s) => (
        <div className={`nav-item ${open === s.key ? 'open' : ''}`} key={s.key} onMouseEnter={() => enter(s.key)}>
          <button type="button" className="nav-trigger" aria-expanded={open === s.key} aria-controls={`mega-${s.key}`}
            onClick={() => setOpen((o) => (o === s.key ? null : s.key))}>
            {s.label}<span className="caret" aria-hidden>▾</span>
          </button>
          <div className="mega" id={`mega-${s.key}`} onMouseEnter={() => clearTimeout(timer.current)}>
            <div className="wrap mega-inner">
              <div className="mega-intro">
                <span className="kicker">{s.label}</span>
                <p>{s.intro}</p>
              </div>
              <div className="mega-cols">
                {s.groups.map((g) => (
                  <div className="mega-col" key={g.title}>
                    <h5>{g.title}</h5>
                    {g.items.map((it) => (
                      <Link key={it.label + it.href} href={it.href} className="mega-link" onClick={() => setOpen(null)}>
                        <span className="mi">{it.icon}</span>
                        <span><b>{it.label}{it.badge && <em className="new">{it.badge}</em>}</b>{it.desc && <small>{it.desc}</small>}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}
