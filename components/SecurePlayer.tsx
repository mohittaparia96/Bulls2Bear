'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Playback =
  | { type: 'html5'; src: string; watermark: string }
  | { type: 'vdocipher'; otp: string; playbackInfo: string; watermark: string }
  | { type: 'iframe'; src: string; watermark: string };

type Props = {
  chapterId: string; locked: boolean; loggedIn: boolean; courseSlug: string; nextHref?: string;
  resumeAt?: number; trackProgress: boolean;
};

/**
 * Secure player:
 *  - Fetches a short-lived, user-bound playback credential only after the server checks entitlement.
 *  - Moving, semi-transparent watermark with the viewer's email + ID (deters screen recording / leaks).
 *  - No download button, no picture-in-picture, no right-click menu, no remote playback.
 *  - Re-issues the credential automatically if it expires mid-session.
 */
export default function SecurePlayer({ chapterId, locked, loggedIn, courseSlug, nextHref, resumeAt = 0, trackProgress }: Props) {
  const [pb, setPb] = useState<Playback | null>(null);
  const [error, setError] = useState('');
  const [wm, setWm] = useState({ top: 12, left: 10 });
  const [ended, setEnded] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);

  async function load() {
    setError('');
    const r = await fetch('/api/video/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chapterId }) });
    const d = await r.json();
    if (!r.ok) { setError(d.error || 'Unable to load video.'); return; }
    setPb(d);
  }

  useEffect(() => { if (!locked) load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [chapterId, locked]);

  // Move the watermark to a random position every few seconds.
  useEffect(() => {
    const t = setInterval(() => setWm({ top: 6 + Math.random() * 80, left: 4 + Math.random() * 62 }), 4000);
    return () => clearInterval(t);
  }, []);

  function save(completed = false) {
    const v = video.current;
    if (!trackProgress || !v) return;
    const dur = v.duration;
    if (!Number.isFinite(dur) || dur <= 0) return;
    lastSaved.current = Date.now();
    fetch('/api/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ chapterId, positionSec: Math.floor(v.currentTime), completed: completed || v.currentTime / dur > 0.9 }),
    }).catch(() => {});
  }

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') save(); };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  });

  if (locked) {
    return (
      <div className="player-shell">
        <div className="player-overlay">
          <div>
            <div className="lock">🔒</div>
            <h3>This lesson is part of the full course</h3>
            <p>{loggedIn ? 'Unlock every chapter with a one-time payment and get lifetime access.' : 'Log in if you already own this course, or unlock it with a one-time payment.'}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/courses/${courseSlug}`} className="btn btn-primary">Unlock full course →</Link>
              {!loggedIn && <Link href={`/login?next=/courses/${courseSlug}`} className="btn btn-ghost">Log in</Link>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-shell" onContextMenu={(e) => e.preventDefault()}>
      {pb?.type === 'html5' && (
        <video
          ref={video}
          key={pb.src}
          src={pb.src}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={(e) => { if (resumeAt > 5 && resumeAt < e.currentTarget.duration - 5) e.currentTarget.currentTime = resumeAt; }}
          onTimeUpdate={() => { if (Date.now() - lastSaved.current > 10000) save(); }}
          onPause={() => save()}
          onEnded={() => { save(true); setEnded(true); }}
          onPlay={() => setEnded(false)}
          onError={() => { const t = video.current?.currentTime ?? 0; load().then(() => { if (video.current) video.current.currentTime = t; }); }}
        />
      )}
      {pb?.type === 'iframe' && (
        <iframe src={pb.src} allow="accelerometer; gyroscope; autoplay; encrypted-media; fullscreen" allowFullScreen title="Lesson video" />
      )}
      {pb?.type === 'vdocipher' && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(pb.otp)}&playbackInfo=${encodeURIComponent(pb.playbackInfo)}`}
          allow="encrypted-media; fullscreen" allowFullScreen title="Lesson video"
        />
      )}
      {pb && <span className="watermark" style={{ top: `${wm.top}%`, left: `${wm.left}%` }}>{pb.watermark}</span>}
      {!pb && !error && <div className="player-overlay"><p>Loading secure stream…</p></div>}
      {error && (
        <div className="player-overlay"><div><div className="lock">⚠</div><h3>Can’t play this lesson</h3><p>{error}</p>
          <button className="btn btn-ghost" onClick={load}>Try again</button></div></div>
      )}
      {ended && nextHref && (
        <div className="player-overlay"><div><div className="lock">✓</div><h3>Chapter complete!</h3><p>Ready for the next one?</p>
          <Link href={nextHref} className="btn btn-primary">Next chapter →</Link></div></div>
      )}
    </div>
  );
}
