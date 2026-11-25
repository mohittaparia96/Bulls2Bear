import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { CourseThumb } from '@/components/CourseCard';
import { inr } from '@/lib/format';

export const metadata = { title: 'My learning' };
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireUser('/dashboard');
  const [enrollments, orders, sessions, allCourses] = await Promise.all([
    user.role === 'ADMIN'
      ? prisma.course.findMany({ orderBy: { sortOrder: 'asc' }, include: { chapters: { orderBy: { sortOrder: 'asc' } } } }).then((cs) => cs.map((course) => ({ course })))
      : prisma.enrollment.findMany({ where: { userId: user.id }, include: { course: { include: { chapters: { orderBy: { sortOrder: 'asc' } } } } }, orderBy: { createdAt: 'desc' } }),
    prisma.order.findMany({ where: { userId: user.id, status: 'PAID' }, include: { course: true }, orderBy: { createdAt: 'desc' } }),
    prisma.session.findMany({ where: { userId: user.id }, orderBy: { lastSeenAt: 'desc' } }),
    prisma.course.findMany({ select: { id: true }, orderBy: { sortOrder: 'asc' } }),
  ]);
  const progress = await prisma.progress.findMany({ where: { userId: user.id, completed: true }, select: { chapterId: true } });
  const done = new Set(progress.map((p) => p.chapterId));

  return (
    <div className="wrap" style={{ paddingBottom: 100 }}>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <span className="kicker">My learning</span>
          <h1 style={{ marginTop: 10 }}>Hi, {user.name.split(' ')[0]} 👋</h1>
          <p>{enrollments.length ? 'Pick up right where you left off.' : 'You haven’t unlocked a course yet — start with a free preview.'}</p>
        </div>
        <form action="/api/auth/logout" method="post"><button className="btn btn-ghost btn-sm">Log out</button></form>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: 40 }}>📈</p>
          <h3 style={{ margin: '10px 0' }}>Your library is empty</h3>
          <p style={{ marginBottom: 22 }}>Every course has free lessons. Explore and unlock the one that fits you.</p>
          <Link href="/courses" className="btn btn-primary">Browse courses →</Link>
        </div>
      ) : enrollments.map(({ course }) => {
        const completed = course.chapters.filter((c) => done.has(c.id)).length;
        const pct = Math.round((completed / course.chapters.length) * 100);
        const next = course.chapters.find((c) => !done.has(c.id)) ?? course.chapters[0];
        return (
          <div className={`my-course course-card acc-${course.accent}`} key={course.id} style={{ transform: 'none' }}>
            <CourseThumb course={course} seed={allCourses.findIndex((c) => c.id === course.id) + 3} owned />
            <div>
              <span className="kicker" style={{ fontSize: 11 }}>{course.category}</span>
              <h3 style={{ marginTop: 6 }}>{course.title}</h3>
              <p className="muted" style={{ fontSize: 14 }}>{completed}/{course.chapters.length} chapters · {pct}% complete · Next: {next.title}</p>
              <div className="bar" style={{ maxWidth: 420 }}><i style={{ width: `${pct}%` }} /></div>
            </div>
            <Link href={`/learn/${course.slug}/${next.slug}`} className="btn btn-primary">{completed ? 'Continue' : 'Start'} →</Link>
          </div>
        );
      })}

      <h2 className="tabs-h">Purchase history</h2>
      {orders.length === 0 ? <p className="muted">No purchases yet.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Course</th><th>Amount</th><th>Order ID</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}><td>{o.paidAt?.toLocaleDateString('en-IN') ?? o.createdAt.toLocaleDateString('en-IN')}</td><td>{o.course.title}</td><td>{inr(o.amountPaise)}</td><td className="muted">{o.id}</td><td><span className={`badge ${o.status}`}>{o.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="tabs-h">Active devices</h2>
      <p className="muted" style={{ marginTop: -8, marginBottom: 14, fontSize: 14 }}>Your account can be signed in on a limited number of devices. Signing in elsewhere logs out the oldest device.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Device</th><th>Signed in</th><th>Last active</th></tr></thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{describeUA(s.userAgent)} {s.id === user.sessionId && <span className="badge PAID">This device</span>}</td>
                <td>{s.createdAt.toLocaleString('en-IN')}</td><td>{s.lastSeenAt.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function describeUA(ua: string | null) {
  if (!ua) return 'Unknown device';
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Device';
  const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  return `${br} on ${os}`;
}
