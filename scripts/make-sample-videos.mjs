// Generates short placeholder lesson videos for every chapter in the database, so the demo
// site plays real (protected) video before the founders upload actual content.
// Output: storage/videos/<course-slug>--<chapter-slug>.mp4  (this folder is NOT public)
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const prisma = new PrismaClient();
const outDir = resolve('storage/videos');
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'b2b-'));
const logo = resolve('public/logo.jpg');

const fontCandidates = ['C:/Windows/Fonts/arialbd.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'];
const font = fontCandidates.find((f) => existsSync(f));
const esc = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:');

const chapters = await prisma.chapter.findMany({ include: { course: true }, orderBy: [{ course: { sortOrder: 'asc' } }, { sortOrder: 'asc' }] });
const force = process.argv.includes('--force');
let made = 0;

for (const ch of chapters) {
  const out = join(outDir, ch.videoId);
  if (existsSync(out) && !force) continue;
  const t1 = join(tmp, `${ch.id}-1.txt`), t2 = join(tmp, `${ch.id}-2.txt`), t3 = join(tmp, `${ch.id}-3.txt`);
  writeFileSync(t1, ch.course.title.toUpperCase());
  writeFileSync(t2, `Chapter ${ch.sortOrder + 1}: ${ch.title}`);
  writeFileSync(t3, ch.isFree ? 'FREE PREVIEW  -  sample lesson video' : 'PREMIUM LESSON  -  sample lesson video');
  const f = font ? `fontfile='${esc(font)}':` : '';
  const chain = [
    `drawbox=x=0:y=ih-10:w=iw*t/12:h=10:color=0x22c55e@1:t=fill`,
    `drawtext=${f}textfile='${esc(t1)}':x=470:y=250:fontsize=26:fontcolor=0x22c55e`,
    `drawtext=${f}textfile='${esc(t2)}':x=470:y=300:fontsize=38:fontcolor=white`,
    `drawtext=${f}textfile='${esc(t3)}':x=470:y=370:fontsize=22:fontcolor=0x9ca3af`,
    `drawtext=${f}text='%{pts\\:hms}':x=w-tw-40:y=40:fontsize=22:fontcolor=0x6b7280`,
  ].join(',');
  const graph = `[1:v]scale=300:300[l];[0:v][l]overlay=x=110:y=(H-h)/2:shortest=1,${chain}[v]`;
  const args = [
    '-y', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'color=c=0x07090c:s=1280x720:d=12:r=25',
    '-loop', '1', '-i', logo,
    '-f', 'lavfi', '-i', 'sine=frequency=220:sample_rate=44100:duration=12',
    '-filter_complex', `${graph};[2:a]volume=0.04[a]`,
    '-map', '[v]', '-map', '[a]',
    '-t', '12', '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest',
    '-movflags', '+faststart', out,
  ];
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (r.status !== 0) { console.error('ffmpeg failed for', ch.videoId); process.exitCode = 1; break; }
  made++;
  process.stdout.write(`✓ ${ch.videoId}\n`);
}

// ── Vertical 9:16 shorts ──
const accentHex = { green: '0x22e36b', lime: '0xb8f34a', gold: '0xffc83d', cyan: '0x2ee6d6', violet: '0xa58bff', pink: '0xff6ad5' };
const mark = resolve('public/logo-mark.jpg');
const wrapTitle = (t, max = 18) => {
  const lines = []; let cur = '';
  for (const w of t.split(' ')) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
};
const shortsList = await prisma.short.findMany({ orderBy: { sortOrder: 'asc' } });
for (const s of shortsList) {
  const out = join(outDir, s.videoId);
  if (existsSync(out) && !force) continue;
  const col = accentHex[s.accent] ?? accentHex.green;
  const d = s.durationSec;
  const f = font ? `fontfile='${esc(font)}':` : '';
  const lines = wrapTitle(s.title);
  const files = lines.map((l, i) => { const p = join(tmp, `${s.id}-t${i}.txt`); writeFileSync(p, l); return p; });
  const c1 = join(tmp, `${s.id}-c.txt`); writeFileSync(c1, `${s.category.toUpperCase()}  |  UNDER A MINUTE`);
  const chain = [
    `drawbox=x=0:y=0:w=iw*t/${d}:h=10:color=${col}@1:t=fill`,
    `drawtext=${f}textfile='${esc(c1)}':x=(w-tw)/2:y=470:fontsize=24:fontcolor=${col}:box=1:boxcolor=black@0.55:boxborderw=10`,
    ...files.map((p, i) => `drawtext=${f}textfile='${esc(p)}':x=(w-tw)/2:y=${530 + i * 62}:fontsize=50:fontcolor=white`),
    `drawtext=${f}text='sample short - bulls2bear.com':x=(w-tw)/2:y=h-120:fontsize=22:fontcolor=0x94a3b8`,
    `drawtext=${f}text='%{pts\\:hms}':x=(w-tw)/2:y=h-80:fontsize=22:fontcolor=0x64748b`,
  ].join(',');
  const graph = `[1:v]scale=300:300[l];[0:v][l]overlay=x=(W-w)/2:y=110:shortest=1,${chain}[v]`;
  const args = [
    '-y', '-loglevel', 'error',
    '-f', 'lavfi', '-i', `gradients=s=540x960:c0=${col}:c1=0x05080d:x0=270:y0=0:x1=270:y1=640:d=${d}:r=15,format=yuv420p`,
    '-loop', '1', '-i', mark,
    '-f', 'lavfi', '-i', `sine=frequency=330:sample_rate=44100:duration=${d}`,
    '-filter_complex', `${graph};[2:a]volume=0.03[a]`,
    '-map', '[v]', '-map', '[a]',
    '-t', String(d), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '48k', '-shortest',
    '-movflags', '+faststart', out,
  ];
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (r.status !== 0) { console.error('ffmpeg failed for', s.videoId); process.exitCode = 1; break; }
  made++;
  process.stdout.write(`✓ ${s.videoId}\n`);
}

console.log(`Done. Generated ${made} video(s) in ${outDir}`);
await prisma.$disconnect();
