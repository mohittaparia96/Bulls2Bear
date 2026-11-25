'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ShortCard, { type ShortData } from './ShortCard';

type Playback = { type: 'html5'; src: string; watermark: string } | { type: 'iframe' | 'vdocipher'; src?: string; otp?: string; playbackInfo?: string; watermark: string };

export default function ShortsExplorer({ shorts, initialPlay, courseTitles }: { shorts: ShortData[]; initialPlay?: string; courseTitles: Record<string, string> }) {
  const [cat, setCat] = useState('All');
  const list = useMemo(() => (cat === 'All' ? shorts : shorts.filter((s) => s.category === cat)), [shorts, cat]);
  const cats = useMemo(() => ['All', ...Array.from(new Set(shorts.map((s) => s.category)))], [shorts]);
  const [playing, setPlaying] = useState<number | null>(() => {
    const i = initialPlay ? shorts.findIndex((s) => s.slug === initialPlay) : -1;
    return i >= 0 ? i : null;
  });

  // Indexes refer to the filtered list once the viewer opens from the grid; initialPlay uses the full list with cat=All.
  return (
    <>
      <div className="chips" role="group" aria-label="Topic">
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c} <span className="count">{c === 'All' ? shorts.length : shorts.filter((s) => s.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="shorts-grid" style={{ paddingBottom: 100 }}>
        {list.map((s, i) => <ShortCard key={s.id} short={s} onPlay={() => setPlaying(i)} />)}
      </div>
      {playing !== null && list[playing] && (
        <ReelViewer list={list} index={playing} setIndex={setPlaying} courseTitles={courseTitles} />
      )}
    </>
  );
}

function ReelViewer({ list, index, setIndex, courseTitles }: { list: ShortData[]; index: number; setIndex: (i: number | null) => void; courseTitles: Record<string, string> }) {
  const short = list[index];
  const [pb, setPb] = useState<Playback | null>(null);
  const [err, setErr] = useState('');
  const [progress, setProgress] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);
  const [wm, setWm] = useState({ top: 12, left: 10 });
  const video = useRef<HTMLVideoElement>(null);
  const touchY = useRef<number | null>(null);

  const go = useCallback((d: number) => {
    const n = index + d;
    if (n >= 0 && n < list.length) setIndex(n);
  }, [index, list.length, setIndex]);
  const close = useCallback(() => setIndex(null), [setIndex]);

  useEffect(() => {
    let cancelled = false;
    setPb(null); setErr(''); setProgress(0);
    fetch('/api/video/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shortId: short.id }) })
      .then(async (r) => { const d = await r.json(); if (cancelled) return; if (!r.ok) setErr(d.error || 'Unable to play'); else setPb(d); })
      .catch(() => !cancelled && setErr('Unable to play'));
    return () => { cancelled = true; };
  }, [short.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const t = setInterval(() => setWm({ top: 8 + Math.random() * 60, left: 4 + Math.random() * 50 }), 3500);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; clearInterval(t); };
  }, [go, close]);

  const tryPlay = () => video.current?.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));

  return (
    <div className="reel-bg" role="dialog" aria-modal="true" aria-label={short.title} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <button className="reel-close" onClick={close} aria-label="Close">✕</button>
      <button className="reel-nav prev" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous short">↑</button>
      <button className="reel-nav next" onClick={() => go(1)} disabled={index === list.length - 1} aria-label="Next short">↓</button>
      <div
        className={`reel acc-${short.accent}`}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => { if (touchY.current === null) return; const dy = e.changedTouches[0].clientY - touchY.current; if (Math.abs(dy) > 60) go(dy < 0 ? 1 : -1); touchY.current = null; }}
      >
        <div className="reel-progress"><i style={{ width: `${progress}%` }} /></div>
        {pb?.type === 'html5' && (
          <video
            ref={video} key={pb.src} src={pb.src} playsInline autoPlay preload="auto"
            controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback
            onLoadedData={tryPlay}
            onClick={() => { const v = video.current; if (v) { if (v.paused) tryPlay(); else v.pause(); } }}
            onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / (e.currentTarget.duration || 1)) * 100)}
            onEnded={() => (index < list.length - 1 ? go(1) : undefined)}
          />
        )}
        {pb && pb.type !== 'html5' && pb.src && <iframe src={pb.src} allow="autoplay; encrypted-media; fullscreen" title={short.title} style={{ width: '100%', height: '100%', border: 0 }} />}
        {pb && <span className="watermark" style={{ top: `${wm.top}%`, left: `${wm.left}%` }}>{pb.watermark}</span>}
        {needsTap && <button className="tap-hint" onClick={tryPlay} aria-label="Play">▶</button>}
        {!pb && !err && <div className="player-overlay"><p>Loading…</p></div>}
        {err && <div className="player-overlay"><p>{err}</p></div>}
        <div className="reel-info">
          <span className="pill accent">⚡ {short.category}</span>
          <h3>{short.title}</h3>
          {short.courseSlug && courseTitles[short.courseSlug] && (
            <Link href={`/courses/${short.courseSlug}`} className="btn btn-primary btn-sm">Go deeper: {courseTitles[short.courseSlug]} →</Link>
          )}
          <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>{index + 1} / {list.length} · swipe or use ↑ ↓</p>
        </div>
      </div>
    </div>
  );
}
