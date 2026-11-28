'use client';
import { useEffect, useState } from 'react';


export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  useEffect(() => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'), []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('b2b-theme', next); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#eceef2' : '#07080b');
    setTheme(next);
  }

  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  return (
    <button type="button" className={`theme-toggle ${className}`} onClick={toggle} aria-label={label} title={label}>
      <span className="sun" aria-hidden>☀️</span>
      <span className="moon" aria-hidden>🌙</span>
    </button>
  );
}
