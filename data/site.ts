// Editable site content. Replace the [placeholders] with real details before launch.

export const contact = {
  email: 'info@bulls2bear.com',
  phone: '[+91 XXXXX XXXXX]', // shown as text until a real number is added
  phoneHref: '', // e.g. 'tel:+919876543210' — leave empty to hide the call link
  whatsappHref: '', // e.g. 'https://wa.me/919876543210'
  address: '[Office address line 1], [City], [State] – [PIN], India',
  hours: 'Mon–Sat, 10:00 am – 7:00 pm IST',
};

// Paste each channel's public URL. Empty = shown as "Coming soon".
export const socials = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'in', url: '', blurb: 'Company updates, articles and hiring news.' },
  { key: 'youtube', label: 'YouTube', icon: '▶', url: '', blurb: 'Free lessons, market explainers and webinar replays.' },
  { key: 'telegram', label: 'Telegram', icon: '✈', url: '', blurb: 'Daily learning nuggets and new-lesson alerts. No tips, ever.' },
  { key: 'instagram', label: 'Instagram', icon: '◎', url: '', blurb: 'Reels, carousels and 60-second concepts.' },
  { key: 'whatsapp', label: 'WhatsApp channel', icon: '✆', url: '', blurb: 'One message a day: a concept, a chart or a quiz.' },
  { key: 'x', label: 'X (Twitter)', icon: '𝕏', url: '', blurb: 'Quick takes on concepts and market structure.' },
] as const;

export const vision = 'To make every Indian investor market-literate: confident enough to understand risk, ask the right questions and make their own informed decisions.';
export const mission = [
  'Teach markets from first principles: clear, structured and free of hype.',
  'Keep quality learning affordable, with free lessons for everyone to start.',
  'Put risk management and honest data before profits and promises.',
  'Build a community that learns together, from the first trade to advanced derivatives.',
];

export const team = [
  { name: '[Founder name]', role: 'Co-founder', bio: 'Add a 1–2 line bio: market experience, what they teach, why they started bulls2bear.', accent: 'green' },
  { name: '[Founder name]', role: 'Co-founder', bio: 'Add a 1–2 line bio: market experience, what they teach, why they started bulls2bear.', accent: 'gold' },
  { name: '[Team member]', role: 'Head of Content', bio: 'Add a 1–2 line bio for the person who plans and produces the lessons.', accent: 'violet' },
];
