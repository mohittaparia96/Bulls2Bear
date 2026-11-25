import Link from 'next/link';
import { inr, minutes, discountPct } from '@/lib/format';

export type CardCourse = {
  slug: string; title: string; description: string; category: string; level: string; icon: string; accent: string;
  pricePaise: number; mrpPaise: number; chapters: { durationSec: number; isFree: boolean }[];
};

/** Decorative candlestick strip used on course thumbnails (deterministic per seed). */
export function Candles({ seed = 1, accent = 'green' }: { seed?: number; accent?: string }) {
  let x = seed * 9301 + 49297;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  let y = 60;
  const bars = Array.from({ length: 22 }, (_, i) => {
    const up = rnd() > (accent === 'red' ? 0.55 : 0.4);
    const h = 6 + rnd() * 16;
    y = Math.max(15, Math.min(85, y + (up ? -h / 2 : h / 2)));
    return { i, up, h, y };
  });
  return (
    <svg viewBox="0 0 220 100" preserveAspectRatio="none" aria-hidden>
      {bars.map((b) => (
        <g key={b.i}>
          <line x1={b.i * 10 + 5} x2={b.i * 10 + 5} y1={b.y - 6} y2={b.y + b.h + 6} stroke={b.up ? '#22e36b' : '#ff3d3d'} strokeWidth="1" />
          <rect x={b.i * 10 + 2} y={b.y} width="6" height={b.h} fill={b.up ? '#22e36b' : '#ff3d3d'} rx="1" />
        </g>
      ))}
    </svg>
  );
}

export function CourseThumb({ course, seed, owned }: { course: Pick<CardCourse, 'icon' | 'accent' | 'category' | 'chapters'>; seed: number; owned?: boolean }) {
  const free = course.chapters.filter((c) => c.isFree).length;
  return (
    <div className="course-thumb">
      <Candles seed={seed} accent={course.accent} />
      <span className="icon">{course.icon}</span>
      <div className="badges">
        <span className="pill accent">{course.category}</span>
        {owned ? <span className="pill owned">✓ Owned</span> : free > 0 && <span className="pill">▶ {free} free</span>}
      </div>
    </div>
  );
}

export default function CourseCard({ course, index, owned }: { course: CardCourse; index: number; owned?: boolean }) {
  const total = course.chapters.reduce((s, c) => s + c.durationSec, 0);
  const off = discountPct(course.pricePaise, course.mrpPaise);
  return (
    <Link href={`/courses/${course.slug}`} className={`course-card acc-${course.accent} reveal`}>
      <CourseThumb course={course} seed={index + 3} owned={owned} />
      <div className="course-body">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>▤ {course.chapters.length} chapters</span>
          <span>◷ {minutes(total)}</span>
          <span>◆ {course.level}</span>
        </div>
        <div className="course-foot">
          {owned ? <span className="price green" style={{ fontSize: 17 }}>Continue learning</span> : (
            <span className="price">{inr(course.pricePaise)}{off > 0 && <><s>{inr(course.mrpPaise)}</s><span className="off">{off}% OFF</span></>}</span>
          )}
          <span className="card-arrow">→</span>
        </div>
      </div>
    </Link>
  );
}
