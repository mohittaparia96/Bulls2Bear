import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { segments } from '@/data/research';
import { menu } from '@/data/nav';

export const metadata: Metadata = { title: 'Search', robots: { index: false } };
export const dynamic = 'force-dynamic';

const popular = ['Options', 'Candlesticks', 'Gold', 'SIP', 'IPO', 'Theta', 'Free'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? '').trim().slice(0, 80);
  const has = q.length >= 2;
  const ci = { contains: q, mode: 'insensitive' as const };

  const [courses, chapters, shorts] = has
    ? await Promise.all([
        prisma.course.findMany({ where: { published: true, OR: [{ title: ci }, { subtitle: ci }, { description: ci }, { category: ci }, { level: ci }] }, orderBy: { sortOrder: 'asc' } }),
        prisma.chapter.findMany({ where: { course: { published: true }, OR: [{ title: ci }, { summary: ci }] }, include: { course: { select: { slug: true, title: true } } }, take: 12 }),
        prisma.short.findMany({ where: { published: true, OR: [{ title: ci }, { category: ci }] }, orderBy: { sortOrder: 'asc' } }),
      ])
    : [[], [], []];

  const ql = q.toLowerCase();
  const research = has ? segments.filter((s) => [s.title, s.tagline, s.intro].some((t) => t.toLowerCase().includes(ql))) : [];
  const pages = has ? menu.flatMap((m) => m.groups.flatMap((g) => g.items.map((it) => ({ ...it, section: m.label }))))
    .filter((it) => !it.href.startsWith('mailto:') && (it.label + ' ' + it.section + ' ' + (it.desc ?? '')).toLowerCase().includes(ql)) : [];
  const total = courses.length + chapters.length + shorts.length + research.length + pages.length;

  return (
    <div className="wrap" style={{ paddingBottom: 90 }}>
      <div className="page-head">
        <span className="kicker">⌕ Search</span>
        <h1>{has ? <>Results for <span className="grad-text">“{q}”</span></> : 'Search bulls2bear'}</h1>
        <form action="/search" className="search-big" role="search">
          <input className="input" name="q" defaultValue={q} placeholder="Try “options”, “gold” or “SIP”" aria-label="Search" autoFocus={!has} />
          <button className="btn btn-primary">Search</button>
        </form>
        <div className="chips" style={{ marginTop: 16 }}>
          {popular.map((p) => <Link key={p} href={`/search?q=${encodeURIComponent(p)}`} className="chip">{p}</Link>)}
        </div>
      </div>

      {has && total === 0 && <div className="empty">No results for “{q}”. Try a broader word, or <Link href="/courses" className="link">browse all courses</Link>.</div>}

      {courses.length > 0 && <Group title="🎓 Courses">{courses.map((c) => <Hit key={c.id} href={`/courses/${c.slug}`} icon={c.icon} title={c.title} sub={`${c.category} · ${c.level}`} />)}</Group>}
      {chapters.length > 0 && <Group title="📖 Lessons">{chapters.map((ch) => <Hit key={ch.id} href={`/courses/${ch.course.slug}`} icon={ch.isFree ? '🎁' : '🔒'} title={ch.title} sub={`${ch.course.title}${ch.isFree ? ' · Free preview' : ''}`} />)}</Group>}
      {shorts.length > 0 && <Group title="⚡ Shorts">{shorts.map((s) => <Hit key={s.id} href={`/shorts?play=${s.slug}`} icon={s.emoji} title={s.title} sub={`${s.category} · ${s.durationSec}s`} />)}</Group>}
      {research.length > 0 && <Group title="🔬 Research">{research.map((s) => <Hit key={s.slug} href={`/research/${s.slug}`} icon={s.icon} title={s.title} sub={s.tagline} />)}</Group>}
      {pages.length > 0 && <Group title="🧭 Pages">{pages.map((p) => <Hit key={p.href + p.label} href={p.href} icon={p.icon} title={p.label} sub={p.section} />)}</Group>}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="search-group"><h2>{title}</h2><div className="search-hits">{children}</div></section>;
}
function Hit({ href, icon, title, sub }: { href: string; icon: string; title: string; sub: string }) {
  return <Link href={href} className="search-hit"><span className="mi">{icon}</span><span><b>{title}</b><small>{sub}</small></span><span className="go">→</span></Link>;
}
