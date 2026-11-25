import Legal from '@/components/Legal';
export const metadata = { title: 'Disclaimer' };

export default function Disclaimer() {
  return (
    <Legal title="Disclaimer">
      <p>bulls2bear is an investor-education platform. All courses, webinars, examples and communications are for educational and informational purposes only.</p>
      <h2>Not investment advice</h2>
      <p>We are not registered with SEBI as an Investment Adviser or Research Analyst. Nothing we publish is a recommendation or solicitation to buy, sell or hold any security or derivative. Examples using real instruments are illustrative only.</p>
      <h2>Risk warning</h2>
      <p>Investments in securities markets are subject to market risks. Trading in derivatives (futures and options) carries a high risk of loss; SEBI studies have found that a large majority of individual F&amp;O traders incur net losses. Past performance does not guarantee future results.</p>
      <h2>Do your own research</h2>
      <p>Consult a SEBI-registered investment adviser before making any investment decision. You are solely responsible for your trades and investments.</p>
    </Legal>
  );
}
