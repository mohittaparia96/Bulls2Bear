import Legal from '@/components/Legal';
export const metadata = { title: 'Refund & cancellation policy' };

export default function Refund() {
  return (
    <Legal title="Refund & cancellation policy">
      <p>We want you to be confident before you buy — that’s why every course includes free preview chapters.</p>
      <h2>Eligibility</h2>
      <p>You may request a full refund within <b>7 days</b> of purchase if you have watched less than <b>25%</b> of the course. Requests after 7 days, or after 25% of the course is consumed, are not eligible.</p>
      <h2>How to request</h2>
      <p>Email info@bulls2bear.com from your registered email with your Order ID. Approved refunds are processed to the original payment method within 5–7 business days via Razorpay.</p>
      <h2>Cancellations</h2>
      <p>Courses are one-time purchases with no recurring billing, so there is nothing to cancel. Course access is revoked when a refund is issued.</p>
      <h2>Failed or duplicate payments</h2>
      <p>If money was debited but the course was not unlocked, it is either auto-refunded by the bank/Razorpay within 5–7 business days, or contact us and we’ll resolve it.</p>
    </Legal>
  );
}
