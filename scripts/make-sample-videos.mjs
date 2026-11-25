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

console.log(`Done. Generated ${made} video(s) in ${outDir}`);
await prisma.$disconnect();
