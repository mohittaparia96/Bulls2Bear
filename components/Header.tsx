import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import MobileMenu from './MobileMenu';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="bulls2bear home">
      <Image src="/logo-mark.jpg" alt="" width={46} height={46} priority />
      <span className="brand-text">
        <span className="brand-name">bulls<span className="two">2</span>bear</span>
        <span className="brand-tag">TRADE SMART. LEARN. GROW.</span>
      </span>
    </Link>
  );
}

export const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/shorts', label: 'Shorts', badge: 'NEW' },
  { href: '/about', label: 'About us' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="header">
      <div className="wrap header-inner">
        <Brand />
        <nav className="nav" aria-label="Main">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}{l.badge && <span className="new">{l.badge}</span>}</Link>
          ))}
        </nav>
        <div className="header-cta">
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link href="/admin" className="btn btn-ghost btn-sm hide-m">Admin</Link>}
              <Link href="/dashboard" className="btn btn-ghost btn-sm hide-m">My learning</Link>
              <Link href="/dashboard" className="avatar" title={user.email}>{user.name.charAt(0).toUpperCase()}</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hide-m">Log in</Link>
              <Link href="/signup" className="btn btn-primary btn-sm hide-s">Start free</Link>
            </>
          )}
          <MobileMenu links={navLinks} loggedIn={!!user} isAdmin={user?.role === 'ADMIN'} />
        </div>
      </div>
    </header>
  );
}
