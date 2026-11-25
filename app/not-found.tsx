import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section center">
      <div className="wrap">
        <p style={{ fontSize: 90, fontWeight: 800, fontFamily: 'var(--font-head)' }} className="grad-text">404</p>
        <h1 style={{ fontSize: 32, margin: '10px 0 14px' }}>This page took a bearish turn.</h1>
        <p className="muted" style={{ marginBottom: 28 }}>The page you’re looking for doesn’t exist or has moved.</p>
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
