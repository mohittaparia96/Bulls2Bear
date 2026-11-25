import Link from 'next/link';

export type ShortData = { id: string; slug: string; title: string; category: string; durationSec: number; emoji: string; accent: string; courseSlug: string | null };

const secs = (s: number) => `0:${String(s).padStart(2, '0')}`;

/** A 9:16 short thumbnail. Pass `href` to link (server pages) or `onPlay` to open the reel viewer in place. */
export default function ShortCard({ short, href, onPlay }: { short: ShortData; href?: string; onPlay?: () => void }) {
  const inner = (
    <>
      <div className="top"><span className="pill">⚡ {short.category}</span><span className="pill">{secs(short.durationSec)}</span></div>
      <span className="emoji" aria-hidden>{short.emoji}</span>
      <span className="play" aria-hidden>▶</span>
      <div className="bottom"><small>Under a minute</small><b>{short.title}</b></div>
    </>
  );
  const cls = `short-card acc-${short.accent}`;
  return href
    ? <Link href={href} className={cls} aria-label={`Play short: ${short.title}`}>{inner}</Link>
    : <button type="button" className={cls} onClick={onPlay} aria-label={`Play short: ${short.title}`}>{inner}</button>;
}
