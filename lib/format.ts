export const inr = (paise: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);

export const minutes = (sec: number) => {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim() : `${m} min`;
};

export const discountPct = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const SITE = {
  name: 'bulls2bear',
  tagline: 'Trade smart. Learn. Grow.',
  email: 'info@bulls2bear.com',
  url: 'https://bulls2bear.com',
};
