import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], style: ['normal', 'italic'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://bulls2bear.com'),
  title: { default: 'bulls2bear — Stock Market, F&O & Technical Analysis Courses', template: '%s · bulls2bear' },
  description: 'Learn the stock market the right way. Structured video courses on market basics, technical analysis, futures & options, Greeks and trading psychology. Start with free lessons.',
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
  openGraph: { title: 'bulls2bear — Trade smart. Learn. Grow.', description: 'Structured stock-market video courses for Indian investors and traders.', images: ['/logo.jpg'], type: 'website' },
};

export const viewport: Viewport = { themeColor: '#05070a' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Header />
        <div id="mobile-nav-slot" />
        <main>{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
