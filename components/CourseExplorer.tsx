'use client';
import { useMemo, useState, useEffect } from 'react';
import CourseCard, { type CardCourse } from './CourseCard';

export type ExplorerCourse = CardCourse & { id: string; owned: boolean; index: number };
type Filters = { q: string; cat: string; price: string; level: string; sort: string };

const SORTS: Record<string, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price: low → high',
  'price-desc': 'Price: high → low',
  'dur-asc': 'Duration: shortest first',
  'dur-desc': 'Duration: longest first',
  'free-desc': 'Most free lessons',
};

const totalSec = (c: ExplorerCourse) => c.chapters.reduce((s, x) => s + x.durationSec, 0);
const levelBucket = (l: string) => (/advanced/i.test(l) ? 'Advanced' : /intermediate/i.test(l) ? 'Intermediate' : /beginner/i.test(l) ? 'Beginner' : 'All levels');

export default function CourseExplorer({ courses, initial }: { courses: ExplorerCourse[]; initial: Partial<Filters> }) {
  const [f, setF] = useState<Filters>({ q: '', cat: 'All', price: 'all', level: 'all', sort: 'recommended', ...initial });
  const set = (patch: Partial<Filters>) => setF((p) => ({ ...p, ...patch }));

  // Keep filters in the URL so links like /courses?cat=F%26O&sort=price-desc are shareable.
  useEffect(() => {
    const p = new URLSearchParams();
    if (f.q) p.set('q', f.q);
    if (f.cat !== 'All') p.set('cat', f.cat);
    if (f.price !== 'all') p.set('price', f.price);
    if (f.level !== 'all') p.set('level', f.level);
    if (f.sort !== 'recommended') p.set('sort', f.sort);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `/courses?${qs}` : '/courses');
  }, [f]);

  const cats = useMemo(() => {
    const m = new Map<string, number>();
    courses.forEach((c) => m.set(c.category, (m.get(c.category) ?? 0) + 1));
    return [['All', courses.length] as const, ...Array.from(m.entries())];
  }, [courses]);

  const shown = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = courses.filter((c) =>
      (f.cat === 'All' || c.category === f.cat) &&
      (f.price === 'all' || (f.price === 'free' ? c.pricePaise === 0 : f.price === 'paid' ? c.pricePaise > 0 : f.price === 'owned' ? c.owned : true)) &&
      (f.level === 'all' || levelBucket(c.level) === f.level || c.level === 'All levels') &&
      (!q || `${c.title} ${c.description} ${c.category}`.toLowerCase().includes(q)),
    );
    const by: Record<string, (a: ExplorerCourse, b: ExplorerCourse) => number> = {
      recommended: (a, b) => a.index - b.index,
      'price-asc': (a, b) => a.pricePaise - b.pricePaise,
      'price-desc': (a, b) => b.pricePaise - a.pricePaise,
      'dur-asc': (a, b) => totalSec(a) - totalSec(b),
      'dur-desc': (a, b) => totalSec(b) - totalSec(a),
      'free-desc': (a, b) => b.chapters.filter((x) => x.isFree).length - a.chapters.filter((x) => x.isFree).length,
    };
    return [...list].sort(by[f.sort] ?? by.recommended);
  }, [courses, f]);

  const dirty = f.q || f.cat !== 'All' || f.price !== 'all' || f.level !== 'all' || f.sort !== 'recommended';

  return (
    <>
      <div className="toolbar">
        <label className="search"><span className="sr-only">Search courses</span>
          <input className="input" type="search" placeholder="Search courses — e.g. options, RSI, SIP…" value={f.q} onChange={(e) => set({ q: e.target.value })} />
        </label>
        <select className="select" aria-label="Price" value={f.price} onChange={(e) => set({ price: e.target.value })}>
          <option value="all">💰 Any price</option>
          <option value="free">🎁 Free courses</option>
          <option value="paid">⭐ Premium courses</option>
          {courses.some((c) => c.owned) && <option value="owned">✓ My courses</option>}
        </select>
        <select className="select" aria-label="Level" value={f.level} onChange={(e) => set({ level: e.target.value })}>
          <option value="all">🎯 All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select className="select" aria-label="Sort" value={f.sort} onChange={(e) => set({ sort: e.target.value })}>
          {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>↕ {v}</option>)}
        </select>
      </div>

      <div className="chips" role="group" aria-label="Category">
        {cats.map(([c, n]) => (
          <button key={c} className={`chip ${f.cat === c ? 'active' : ''}`} onClick={() => set({ cat: c })}>
            {c} <span className="count">{n}</span>
          </button>
        ))}
      </div>

      <div className="results-line">
        <span>Showing <b style={{ color: 'var(--text)' }}>{shown.length}</b> of {courses.length} courses</span>
        {dirty && <button className="link-btn" onClick={() => setF({ q: '', cat: 'All', price: 'all', level: 'all', sort: 'recommended' })}>✕ Clear filters</button>}
      </div>

      <div className="course-grid" style={{ paddingBottom: 100 }}>
        {shown.map((c) => <CourseCard key={c.id} course={c} index={c.index} owned={c.owned} />)}
      </div>
      {shown.length === 0 && (
        <div className="empty" style={{ marginBottom: 100 }}>
          <p style={{ fontSize: 40 }}>🔍</p>
          <p>No courses match these filters.</p>
        </div>
      )}
    </>
  );
}
