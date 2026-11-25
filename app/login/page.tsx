import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { paymentsLive } from '@/lib/config';

export const metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
  return (
    <AuthShell title="Welcome back" sub="Log in to continue your learning.">
      <AuthForm mode="login" next={next} />
      <p className="alt">New to bulls2bear? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Create a free account</Link></p>
      {!paymentsLive() && (
        <div className="demo-creds">
          <b>Demo accounts (preview only)</b><br />
          Student: <code>demo@bulls2bear.com</code> / <code>Demo@12345</code><br />
          Admin: <code>admin@bulls2bear.com</code> / <code>ChangeMe@12345</code>
        </div>
      )}
    </AuthShell>
  );
}
