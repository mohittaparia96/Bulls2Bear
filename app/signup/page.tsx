import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Create your account' };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
  return (
    <AuthShell title="Create your account" sub="Free forever. Unlock full courses whenever you’re ready.">
      <AuthForm mode="signup" next={next} />
      <p className="alt">Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Log in</Link></p>
    </AuthShell>
  );
}
