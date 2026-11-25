// "Learn in under a minute" — short vertical videos (9:16). Free for everyone; they act as the hook into full courses.
// `course` links a short to the long-form course that goes deeper. Edit freely, then run `npm run db:seed`.
export type SeedShort = { slug: string; title: string; category: string; sec: number; emoji: string; accent: string; course?: string };

export const shorts: SeedShort[] = [
  { slug: 'what-is-a-stock', title: 'What is a stock, really?', category: 'Basics', sec: 45, emoji: '🏢', accent: 'green', course: 'market-basics-starter' },
  { slug: 'nifty-vs-sensex', title: 'Nifty vs Sensex in 50 seconds', category: 'Basics', sec: 50, emoji: '📈', accent: 'lime', course: 'stock-market-foundations' },
  { slug: 'market-vs-limit', title: 'Market order vs Limit order', category: 'Basics', sec: 40, emoji: '🎯', accent: 'cyan', course: 'stock-market-foundations' },
  { slug: 'doji-candle', title: 'The Doji candle, decoded', category: 'Charts', sec: 35, emoji: '🕯️', accent: 'cyan', course: 'technical-analysis-essentials' },
  { slug: 'support-resistance', title: 'Support & resistance in 1 minute', category: 'Charts', sec: 55, emoji: '🧱', accent: 'gold', course: 'technical-analysis-essentials' },
  { slug: 'what-is-rsi', title: 'What is RSI?', category: 'Charts', sec: 48, emoji: '🌡️', accent: 'violet', course: 'technical-analysis-essentials' },
  { slug: 'call-option-60s', title: 'A call option in 60 seconds', category: 'F&O', sec: 58, emoji: '📞', accent: 'gold', course: 'futures-options-foundations' },
  { slug: 'theta-decay', title: 'Theta decay: time is money', category: 'F&O', sec: 42, emoji: '⏳', accent: 'violet', course: 'options-greeks-risk' },
  { slug: 'why-fo-traders-lose', title: 'Why most F&O traders lose', category: 'F&O', sec: 52, emoji: '⚠️', accent: 'pink', course: 'futures-options-foundations' },
  { slug: 'revenge-trading', title: 'Revenge trading — stop it', category: 'Mindset', sec: 38, emoji: '🧠', accent: 'pink', course: 'trading-psychology' },
  { slug: 'one-percent-rule', title: 'The 1% risk rule', category: 'Mindset', sec: 44, emoji: '🛡️', accent: 'green', course: 'trading-psychology' },
  { slug: 'sip-vs-lumpsum', title: 'SIP vs Lumpsum', category: 'Investing', sec: 50, emoji: '🌱', accent: 'lime', course: 'mutual-funds-investing' },
];
