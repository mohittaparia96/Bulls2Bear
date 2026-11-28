// Main menu. Each section opens a drop-down panel on desktop and an accordion on mobile.
import { contact } from './site';

export type MenuItem = { label: string; href: string; icon: string; desc?: string; badge?: string };
export type MenuSection = { key: string; label: string; intro: string; groups: { title: string; items: MenuItem[] }[] };

export const menu: MenuSection[] = [
  {
    key: 'products', label: 'Products', intro: 'Courses and tools to take you from beginner to confident trader.',
    groups: [
      { title: 'Equity derivatives', items: [
        { label: 'Beginner course', href: '/courses/futures-options-foundations', icon: '⚡', desc: 'Futures & options from scratch' },
        { label: 'Intermediate course', href: '/courses/options-greeks-risk', icon: '🧮', desc: 'Greeks, spreads & risk' },
      ] },
      { title: 'Commodity trading', items: [
        { label: 'Beginner course', href: '/courses/commodity-trading-beginner', icon: '🛢️', desc: 'Gold, crude & MCX basics' },
        { label: 'Advanced course', href: '/courses/commodity-trading-advanced', icon: '🥇', desc: 'Global drivers, spreads & hedging' },
      ] },
      { title: 'More', items: [
        { label: 'Mobile application', href: '/app', icon: '📱', desc: 'Learn on the go', badge: 'SOON' },
        { label: 'All courses', href: '/courses', icon: '🎓', desc: 'Filter by price, level & topic' },
        { label: 'Free courses', href: '/courses?price=free', icon: '🎁', desc: 'Start without a card' },
      ] },
    ],
  },
  {
    key: 'research', label: 'Research', intro: 'Plain-language explainers for every market segment.',
    groups: [
      { title: 'Markets', items: [
        { label: 'Stocks', href: '/research/stocks', icon: '📈', desc: 'Equity cash market' },
        { label: 'Derivatives', href: '/research/derivatives', icon: '⚡', desc: 'Futures & options' },
        { label: 'Commodity', href: '/research/commodity', icon: '🛢️', desc: 'Metals, energy & agri' },
      ] },
      { title: 'More segments', items: [
        { label: 'Currency', href: '/research/currency', icon: '💱', desc: 'USD-INR and friends' },
        { label: 'Mutual funds', href: '/research/mutual-funds', icon: '🌱', desc: 'SIPs, categories & costs' },
        { label: 'IPO', href: '/research/ipo', icon: '🔔', desc: 'How IPOs work in India' },
      ] },
    ],
  },
  {
    key: 'academy', label: 'Academy', intro: 'Three learning paths: pick your level and follow the steps.',
    groups: [
      { title: 'Learning paths', items: [
        { label: 'bulls2bear Beginner learning', href: '/academy#beginner', icon: '🌱', desc: 'Start here: zero to first trade' },
        { label: 'bulls2bear Intermediate learning', href: '/academy#intermediate', icon: '🚀', desc: 'Charts, F&O and commodities' },
        { label: 'bulls2bear Advanced learning', href: '/academy#advanced', icon: '🏆', desc: 'Greeks, hedging and strategy' },
      ] },
      { title: 'Quick learning', items: [
        { label: 'Shorts (under 1 min)', href: '/shorts', icon: '⚡', desc: 'Free 60-second lessons', badge: 'NEW' },
        { label: 'Live webinars', href: '/#live', icon: '🎙️', desc: 'Learn live with Q&A' },
      ] },
    ],
  },
  {
    key: 'join', label: 'Join 2 Grow', intro: 'Learn with the community, wherever you hang out.',
    groups: [
      { title: 'Follow us', items: [
        { label: 'LinkedIn', href: '/join#linkedin', icon: '💼' },
        { label: 'YouTube', href: '/join#youtube', icon: '▶️' },
        { label: 'Instagram', href: '/join#instagram', icon: '📸' },
        { label: 'X (Twitter)', href: '/join#x', icon: '𝕏' },
      ] },
      { title: 'Get updates', items: [
        { label: 'Telegram', href: '/join#telegram', icon: '✈️' },
        { label: 'WhatsApp channel', href: '/join#whatsapp', icon: '💬' },
        { label: 'Newsletters', href: '/join#newsletter', icon: '📬', desc: 'A weekly lesson by email' },
      ] },
    ],
  },
  {
    key: 'about', label: 'About us', intro: 'Who we are, what we believe and how we teach.',
    groups: [
      { title: 'Who we are', items: [
        { label: 'Vision', href: '/about#vision', icon: '🔭' },
        { label: 'Mission', href: '/about#mission', icon: '🎯' },
        { label: 'What we do & how we do it', href: '/about#what-we-do', icon: '🛠️' },
        { label: 'Learning material', href: '/about#material', icon: '📚' },
      ] },
      { title: 'Reach us', items: [
        { label: 'Email', href: `mailto:${contact.email}`, icon: '✉️', desc: contact.email },
        { label: 'Phone number', href: '/about#contact', icon: '📞', desc: contact.phone },
        { label: 'Address', href: '/about#contact', icon: '📍', desc: 'Our office' },
      ] },
    ],
  },
  {
    key: 'support', label: 'Support', intro: "Stuck somewhere? We're here to help.",
    groups: [
      { title: 'Get help', items: [
        { label: 'Email support', href: `mailto:${contact.email}`, icon: '✉️', desc: contact.email },
        { label: 'Phone number', href: '/support#contact', icon: '📞', desc: contact.hours },
        { label: "FAQ's", href: '/support#faq', icon: '❓', desc: 'Quick answers' },
        { label: 'Send us a message', href: '/contact', icon: '📝' },
      ] },
    ],
  },
];
