import Link from 'next/link';
import { Brand } from './Header';
import AjaxForm from './AjaxForm';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="about">Structured, practical stock-market education for Indian retail investors and traders — from your first trade to option Greeks.</p>
            <div className="socials">
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="X / Twitter">𝕏</a>
              <a href="#" aria-label="Telegram">✈</a>
            </div>
          </div>
          <div>
            <h4>Learn</h4>
            <div className="footer-links">
              <Link href="/courses">All courses</Link>
              <Link href="/courses?cat=F%26O">Futures &amp; Options</Link>
              <Link href="/courses?cat=Technical%20Analysis">Technical analysis</Link>
              <Link href="/#live">Webinars</Link>
              <Link href="/dashboard">My learning</Link>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div className="footer-links">
              <Link href="/contact">Contact us</Link>
              <Link href="/terms">Terms of use</Link>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/refund-policy">Refund policy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
          </div>
          <div>
            <h4>Weekly market lessons</h4>
            <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>One short, practical lesson every Sunday. No spam, no tips.</p>
            <AjaxForm endpoint="/api/newsletter" className="newsletter" compact>
              <input className="input" name="email" type="email" required placeholder="you@email.com" aria-label="Email" />
              <button className="btn btn-primary btn-sm" aria-label="Subscribe">→</button>
            </AjaxForm>
            <p className="muted" style={{ fontSize: 14, marginTop: 18 }}>✉ <a href="mailto:info@bulls2bear.com" className="link">info@bulls2bear.com</a></p>
          </div>
        </div>
        <p className="disclaimer-bar">
          <b>Disclaimer:</b> bulls2bear provides educational content only. We are not a SEBI-registered investment adviser or research analyst
          and nothing on this website is a recommendation to buy or sell any security. Investments in securities markets are subject to market risks;
          read all related documents carefully before investing. Past performance is not indicative of future returns.
        </p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} bulls2bear. All rights reserved.</span>
          <span>Made in India 🇮🇳 · Payments secured by Razorpay</span>
        </div>
      </div>
    </footer>
  );
}
