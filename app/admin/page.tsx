import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { inr } from '@/lib/format';
import { paymentsLive, config } from '@/lib/config';
import GrantAccess from './GrantAccess';

export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function Admin() {
  await requireAdmin();
  const [students, paid, revenue, enquiries, webinars, subs, orders, courses, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amountPaise: true } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.webinarRegistration.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.newsletterSubscriber.count(),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: true, course: true } }),
    prisma.course.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { enrollments: true, chapters: true } } } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { _count: { select: { enrollments: true } } } }),
  ]);

  return (
    <div className="wrap" style={{ paddingBottom: 100 }}>
      <div className="page-head">
        <span className="kicker">Admin console</span>
        <h1 style={{ marginTop: 10 }}>Business overview</h1>
        <p>
          Payments: <b className={paymentsLive() ? 'green' : ''} style={{ color: paymentsLive() ? undefined : 'var(--gold)' }}>{paymentsLive() ? 'Razorpay LIVE' : 'Demo mode'}</b> ·
          Video: <b>{config.videoProvider}</b> · Subscribers: <b>{subs}</b>
        </p>
      </div>

      <div className="admin-grid">
        <div className="stat" style={{ borderRadius: 16, border: '1px solid var(--line)' }}><b className="green">{inr(revenue._sum.amountPaise ?? 0)}</b><span>Total revenue</span></div>
        <div className="stat" style={{ borderRadius: 16, border: '1px solid var(--line)' }}><b>{paid}</b><span>Paid orders</span></div>
        <div className="stat" style={{ borderRadius: 16, border: '1px solid var(--line)' }}><b>{students}</b><span>Registered students</span></div>
        <div className="stat" style={{ borderRadius: 16, border: '1px solid var(--line)' }}><b>{enquiries.length}</b><span>Recent enquiries</span></div>
      </div>

      <GrantAccess courses={courses.map((c) => ({ id: c.id, title: c.title }))} />

      <h2 className="tabs-h">Courses</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Course</th><th>Chapters</th><th>Price</th><th>Students</th></tr></thead>
        <tbody>{courses.map((c) => <tr key={c.id}><td>{c.title}</td><td>{c._count.chapters}</td><td>{inr(c.pricePaise)}</td><td>{c._count.enrollments}</td></tr>)}</tbody>
      </table></div>

      <h2 className="tabs-h">Recent orders</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Date</th><th>Student</th><th>Course</th><th>Amount</th><th>Via</th><th>Status</th></tr></thead>
        <tbody>
          {orders.length === 0 && <tr><td colSpan={6} className="muted">No orders yet.</td></tr>}
          {orders.map((o) => <tr key={o.id}><td>{o.createdAt.toLocaleString('en-IN')}</td><td>{o.user.email}</td><td>{o.course.title}</td><td>{inr(o.amountPaise)}</td><td>{o.provider}</td><td><span className={`badge ${o.status}`}>{o.status}</span></td></tr>)}
        </tbody>
      </table></div>

      <h2 className="tabs-h">Recent sign-ups</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Joined</th><th>Name</th><th>Email</th><th>Phone</th><th>Courses</th></tr></thead>
        <tbody>{recentUsers.map((u) => <tr key={u.id}><td>{u.createdAt.toLocaleDateString('en-IN')}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone ?? '—'}</td><td>{u._count.enrollments}</td></tr>)}</tbody>
      </table></div>

      <h2 className="tabs-h">Enquiries</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Interest</th><th>Message</th></tr></thead>
        <tbody>
          {enquiries.length === 0 && <tr><td colSpan={6} className="muted">No enquiries yet.</td></tr>}
          {enquiries.map((e) => <tr key={e.id}><td>{e.createdAt.toLocaleDateString('en-IN')}</td><td>{e.name}</td><td>{e.email}</td><td>{e.phone ?? '—'}</td><td>{e.interest}</td><td style={{ whiteSpace: 'normal', minWidth: 240 }}>{e.message ?? '—'}</td></tr>)}
        </tbody>
      </table></div>

      <h2 className="tabs-h">Webinar registrations</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Topic</th></tr></thead>
        <tbody>
          {webinars.length === 0 && <tr><td colSpan={5} className="muted">No registrations yet.</td></tr>}
          {webinars.map((w) => <tr key={w.id}><td>{w.createdAt.toLocaleDateString('en-IN')}</td><td>{w.name}</td><td>{w.email}</td><td>{w.phone ?? '—'}</td><td>{w.topic}</td></tr>)}
        </tbody>
      </table></div>
    </div>
  );
}
