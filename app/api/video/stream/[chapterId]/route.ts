import { NextRequest } from 'next/server';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { Readable } from 'node:stream';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { verifyStreamToken } from '@/lib/video';

export const runtime = 'nodejs';
const VIDEO_DIR = join(process.cwd(), 'storage', 'videos');

const deny = (status = 403) => new Response('Forbidden', { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * DEMO provider stream. Protections:
 *  1. Signed token, expires in 10 minutes, scoped to one chapter.
 *  2. Paid chapters: token is bound to the viewer's login session — a copied URL is useless elsewhere.
 *  3. Rejects direct navigation (Sec-Fetch-Dest must be "video"), so pasting the URL in a tab won't download it.
 *  4. Files live outside /public and are never cached.
 * For production use VIDEO_PROVIDER=vdocipher (DRM) — see README.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const token = req.nextUrl.searchParams.get('t');
  if (!token) return deny(401);

  const dest = req.headers.get('sec-fetch-dest');
  if (dest && dest !== 'video' && dest !== 'audio') return deny();

  let claims: { cid: string; sid: string | null };
  try { claims = await verifyStreamToken(token); } catch { return deny(401); }
  if (claims.cid !== chapterId) return deny();

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) return deny(404);
  if (!chapter.isFree) {
    const user = await getCurrentUser();
    if (!user || !claims.sid || user.sessionId !== claims.sid) return deny(401);
  }

  const file = join(VIDEO_DIR, basename(chapter.videoId));
  if (!existsSync(file)) return new Response('Video not uploaded yet', { status: 404 });
  const size = statSync(file).size;

  const headers: Record<string, string> = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, no-store, max-age=0',
    'Content-Disposition': 'inline',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  const range = req.headers.get('range');
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m?.[1] ? parseInt(m[1], 10) : 0;
    let end = m?.[2] ? parseInt(m[2], 10) : Math.min(start + 2 * 1024 * 1024 - 1, size - 1); // 2 MB chunks
    if (!m?.[1] && m?.[2]) { start = size - parseInt(m[2], 10); end = size - 1; }
    end = Math.min(end, size - 1);
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    const stream = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) } });
  }

  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(stream, { status: 200, headers: { ...headers, 'Content-Length': String(size) } });
}
