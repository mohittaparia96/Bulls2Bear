import Link from 'next/link';

/** Switch between the two halves of the video library: long-form courses and under-a-minute shorts. */
export default function LibraryTabs({ active, courses, shorts }: { active: 'courses' | 'shorts'; courses: number; shorts: number }) {
  return (
    <div className="lib-tabs" role="tablist">
      <Link href="/courses" className={active === 'courses' ? 'active' : ''} role="tab" aria-selected={active === 'courses'}>
        🎓 Long-form courses <small>{courses}</small>
      </Link>
      <Link href="/shorts" className={active === 'shorts' ? 'active' : ''} role="tab" aria-selected={active === 'shorts'}>
        ⚡ Shorts · under 1 min <small>{shorts}</small>
      </Link>
    </div>
  );
}
