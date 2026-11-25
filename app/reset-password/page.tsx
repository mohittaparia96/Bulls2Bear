import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';

export const metadata = { title: 'Choose a new password' };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Choose a new password" sub="For your security, you’ll be logged out of all other devices.">
      {token ? <AuthForm mode="reset" token={token} /> : <p className="notice err">This reset link is invalid. Please request a new one.</p>}
      <p className="alt"><Link href="/login">← Back to log in</Link></p>
    </AuthShell>
  );
}
