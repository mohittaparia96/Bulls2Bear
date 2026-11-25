import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { catalog } from '../data/catalog';
import { shorts } from '../data/shorts';

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of catalog.entries()) {
    const data = {
      title: c.title, subtitle: c.subtitle, category: c.category, level: c.level, description: c.description,
      outcomes: JSON.stringify(c.outcomes), pricePaise: c.price * 100, mrpPaise: c.mrp * 100,
      accent: c.accent, icon: c.icon, sortOrder: i,
    };
    const course = await prisma.course.upsert({ where: { slug: c.slug }, update: data, create: { slug: c.slug, ...data } });
    for (const [j, ch] of c.chapters.entries()) {
      const chData = {
        title: ch.title, summary: ch.summary, durationSec: ch.min * 60, sortOrder: j, isFree: !!ch.free,
        videoId: `${c.slug}--${ch.slug}.mp4`,
      };
      await prisma.chapter.upsert({
        where: { courseId_slug: { courseId: course.id, slug: ch.slug } },
        update: chData,
        create: { courseId: course.id, slug: ch.slug, ...chData },
      });
    }
  }

  for (const [i, s] of shorts.entries()) {
    const data = {
      title: s.title, category: s.category, durationSec: s.sec, emoji: s.emoji, accent: s.accent,
      courseSlug: s.course ?? null, videoId: `short--${s.slug}.mp4`, sortOrder: i,
    };
    await prisma.short.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bulls2bear.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe@12345';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: { email: adminEmail, name: 'bulls2bear Admin', role: 'ADMIN', passwordHash: await bcrypt.hash(adminPassword, 12) },
  });

  // Demo student who already owns one course, so founders can see the "purchased" experience instantly.
  const demo = await prisma.user.upsert({
    where: { email: 'demo@bulls2bear.com' },
    update: {},
    create: { email: 'demo@bulls2bear.com', name: 'Demo Student', passwordHash: await bcrypt.hash('Demo@12345', 12) },
  });
  const ta = await prisma.course.findUniqueOrThrow({ where: { slug: 'technical-analysis-essentials' } });
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: demo.id, courseId: ta.id } },
    update: {},
    create: { userId: demo.id, courseId: ta.id, source: 'ADMIN_GRANT' },
  });

  console.log(`Seeded ${catalog.length} courses, ${shorts.length} shorts. Admin: ${adminEmail} | Demo student: demo@bulls2bear.com / Demo@12345`);
}

main().finally(() => prisma.$disconnect());
