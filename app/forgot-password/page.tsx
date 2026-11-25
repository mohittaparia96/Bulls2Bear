import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';

export const metadata = { title: 'Forgot password' };

export default function ForgotPage() {
  return (
    <AuthShell title="Reset your password" sub="Enter your account email and we’ll send you a secure reset link.">
      <AuthForm mode="forgot" />
      <p className="alt"><Link href="/login">← Back to log in</Link></p>
    </AuthShell>
  );
}
