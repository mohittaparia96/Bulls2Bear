import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hasCourseAccess } from '@/lib/auth';
import { badOrigin, json, rateLimited } from '@/lib/security';
import { issuePlayback } from '@/lib/video';

/** Issues a short-lived, user-bound playback credential — only after an entitlement check. */
export async function POST(req: NextRequest) {
  const blocked = badOrigin(req) || rateLimited(req, 'video-token', 60);
  if (blocked) return blocked;
  const p = z.object({ chapterId: z.string() }).safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: 'Invalid chapter.' }, 400);

  const chapter = await prisma.chapter.findUnique({ where: { id: p.data.chapterId } });
  if (!chapter) return json({ error: 'Chapter not found.' }, 404);

  const user = await getCurrentUser();
  if (!chapter.isFree) {
    if (!user) return json({ error: 'Please log in to watch this lesson.', login: true }, 401);
    if (!(await hasCourseAccess(user, chapter.courseId))) return json({ error: 'Purchase this course to unlock this lesson.', locked: true }, 403);
  }

  try {
    return json(await issuePlayback(chapter, user));
  } catch (e) {
    console.error(e);
    return json({ error: 'Video is temporarily unavailable.' }, 502);
  }
}
