import 'server-only';

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET || '';
  if (s.length < 32) {
    if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET must be at least 32 characters');
    return new TextEncoder().encode('dev-only-insecure-secret-change-me-please-0000');
  }
  return new TextEncoder().encode(s);
}

export const config = {
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  authSecret: secret,
  maxSessions: Math.max(1, Number(process.env.MAX_ACTIVE_SESSIONS || 2)),
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  videoProvider: (process.env.VIDEO_PROVIDER || 'demo') as 'demo' | 'vdocipher' | 'bunny',
  contactEmail: process.env.CONTACT_EMAIL || 'info@bulls2bear.com',
};

export const paymentsLive = () => Boolean(config.razorpay.keyId && config.razorpay.keySecret);
