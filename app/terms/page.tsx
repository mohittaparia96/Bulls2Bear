import Legal from '@/components/Legal';
export const metadata = { title: 'Terms of use' };

export default function Terms() {
  return (
    <Legal title="Terms of use">
      <p>These terms govern your use of bulls2bear.com (“bulls2bear”, “we”, “us”). By creating an account or purchasing a course you agree to them.</p>
      <h2>1. Educational purpose only</h2>
      <p>All content is for education. Nothing on this platform is investment, legal or tax advice, or a recommendation to buy or sell any security. We are not a SEBI-registered investment adviser or research analyst.</p>
      <h2>2. Your account</h2>
      <p>Your account is personal and non-transferable. You may be signed in on a limited number of devices simultaneously. Sharing credentials, or accounts showing sharing patterns, may be suspended without refund.</p>
      <h2>3. Licence to content</h2>
      <p>On purchase you receive a limited, non-exclusive, non-transferable licence to stream the course for personal, non-commercial use. You may not download, record, copy, redistribute, resell or publicly display any content. Videos carry a personal watermark that identifies your account.</p>
      <h2>4. Payments</h2>
      <p>Prices are in Indian Rupees and inclusive of applicable taxes unless stated otherwise. Payments are processed by Razorpay; we do not store card or bank details.</p>
      <h2>5. Refunds</h2>
      <p>See our <a href="/refund-policy" className="link">Refund policy</a>.</p>
      <h2>6. Changes and termination</h2>
      <p>We may update courses, these terms, or suspend accounts that violate them. Material changes will be notified by email.</p>
      <h2>7. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts at [City] shall have exclusive jurisdiction.</p>
    </Legal>
  );
}
