import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { issuePlayback } from '@/lib/video';

const schema = z.union([z.object({ chapterId: z.string() }), z.object({ shortId: z.string() })]);

/** Issues a short-lived, user-bound playback credential — only after an entitlement check. */
export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'video-token', 90);
  if (blocked) return blocked;
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Invalid video.' }, 400);
  const user = await getCurrentUser();

  let target: { id: string; videoId: string; isFree: boolean };
  if ('shortId' in p.data) {
    const short = await prisma.short.findFirst({ where: { id: p.data.shortId, published: true } });
    if (!short) return json({ error: 'Video not found.' }, 404);
    target = { id: short.id, videoId: short.videoId, isFree: true }; // shorts are free for everyone
  } else {
    const chapter = await prisma.chapter.findUnique({ where: { id: p.data.chapterId } });
    if (!chapter) return json({ error: 'Chapter not found.' }, 404);
    if (!chapter.isFree) {
      if (!user) return json({ error: 'Please log in to watch this lesson.', login: true }, 401);
      if (!(await hasCourseAccess(user, chapter.courseId))) return json({ error: 'Purchase this course to unlock this lesson.', locked: true }, 403);
    }
    target = chapter;
  }

  try {
    return json(await issuePlayback(target, user));
  } catch (e) {
    console.error(e);
    return json({ error: 'Video is temporarily unavailable.' }, 502);
  }
}
