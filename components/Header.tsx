import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import MobileMenu from './MobileMenu';
import MegaNav from './MegaNav';
import ThemeToggle from './ThemeToggle';

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

export function SearchBox({ className = '' }: { className?: string }) {
  return (
    <form action="/search" method="get" role="search" className={`header-search ${className}`}>
      <span aria-hidden>⌕</span>
      <input name="q" type="search" placeholder="Search courses, shorts, topics…" aria-label="Search" />
    </form>
  );
}

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <MegaNav />
        <div className="header-cta">
          <SearchBox className="hide-m" />
          <ThemeToggle />
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link href="/admin" className="btn btn-ghost btn-sm hide-m">Admin</Link>}
              <Link href="/dashboard" className="btn btn-ghost btn-sm hide-m">My learning</Link>
              <Link href="/dashboard" className="avatar" title={user.email}>{user.name.charAt(0).toUpperCase()}</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hide-m">Log in</Link>
              <Link href="/signup" className="btn btn-primary btn-sm hide-s">Sign up</Link>
            </>
          )}
          <MobileMenu loggedIn={!!user} isAdmin={user?.role === 'ADMIN'} />
        </div>
      </div>
    </header>
  );
}
