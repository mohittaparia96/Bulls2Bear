import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import MobileMenu from './MobileMenu';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="bulls2bear home">
      <Image src="/logo.jpg" alt="" width={44} height={44} priority />
      <span>bulls<span className="two">2</span>bear<small>TRADE SMART. LEARN. GROW.</small></span>
    </Link>
  );
}

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/#how', label: 'How it works' },
  { href: '/#live', label: 'Live learning' },
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
          {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
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
              <Link href="/signup" className="btn btn-primary btn-sm">Start free</Link>
            </>
          )}
          <MobileMenu links={links} loggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
