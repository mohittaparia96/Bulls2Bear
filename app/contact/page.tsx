import AjaxForm from '@/components/AjaxForm';
export const metadata = { title: 'Contact us' };

export default function Contact() {
  return (
    <section className="section">
      <div className="wrap split" style={{ alignItems: 'start' }}>
        <div>
          <span className="kicker">Start a conversation</span>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, margin: '16px 0 18px' }}>Let’s find your<br /><em className="grad-text">next step.</em></h1>
          <p className="muted" style={{ fontSize: 17, maxWidth: 460 }}>Questions about a course, a payment, a webinar or our financial-services information? Our team replies within one business day.</p>
          <div className="feature-list" style={{ marginTop: 32, maxWidth: 460 }}>
            <a className="feature" href="mailto:info@bulls2bear.com"><div className="ic">✉</div><div><h4>Email</h4><p>info@bulls2bear.com</p></div></a>
            <div className="feature"><div className="ic">◷</div><div><h4>Support hours</h4><p>Mon–Sat, 10:00 AM – 7:00 PM IST</p></div></div>
            <div className="feature"><div className="ic">⌖</div><div><h4>Office</h4><p>[Registered address], India</p></div></div>
          </div>
        </div>
        <div className="form-card">
          <h3>Send us a message</h3>
          <p className="muted" style={{ fontSize: 14.5, marginBottom: 22 }}>We’ll get back to you at the email you provide.</p>
          <AjaxForm endpoint="/api/enquiries" className="form-grid">
            <div className="form-row">
              <label className="field">Name<input name="name" required minLength={2} placeholder="Your name" /></label>
              <label className="field">Email<input name="email" type="email" required placeholder="you@email.com" /></label>
            </div>
            <div className="form-row">
              <label className="field">Phone<input name="phone" type="tel" placeholder="+91" /></label>
              <label className="field">I’m interested in
                <select name="interest" defaultValue="Academy courses">
                  <option>Academy courses</option><option>Payment / access issue</option><option>F&amp;O education</option>
                  <option>Live classes and webinars</option><option>Financial services information</option><option>Partnerships</option><option>Other</option>
                </select>
              </label>
            </div>
            <label className="field">How can we help?<textarea name="message" rows={5} placeholder="Tell us a little about what you need…" /></label>
            <label className="check"><input type="checkbox" name="consent" value="true" required /> I agree to be contacted about this enquiry and have read the privacy policy.</label>
            <button className="btn btn-primary">Send message →</button>
          </AjaxForm>
        </div>
      </div>
    </section>
  );
}
