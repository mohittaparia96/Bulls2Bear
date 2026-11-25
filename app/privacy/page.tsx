import Legal from '@/components/Legal';
export const metadata = { title: 'Privacy policy' };

export default function Privacy() {
  return (
    <Legal title="Privacy policy">
      <p>This policy explains how bulls2bear collects and uses personal data, in line with the Digital Personal Data Protection Act, 2023.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email, optional mobile number, and a securely hashed password.</li>
        <li>Purchase records: course, amount, order and payment IDs (card/UPI details are handled only by Razorpay).</li>
        <li>Learning data: chapters watched and playback progress.</li>
        <li>Security data: device/browser type and IP address for active sessions, used to protect your account.</li>
        <li>Enquiry, webinar and newsletter form submissions.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To provide course access, process payments, send receipts and service emails, prevent account sharing and fraud, respond to enquiries and, with consent, send educational newsletters.</p>
      <h2>Sharing</h2>
      <p>We share data only with service providers needed to run the platform (payment gateway, video hosting, email and cloud hosting) under confidentiality obligations. We never sell your data.</p>
      <h2>Your rights</h2>
      <p>You may access, correct or delete your data, or withdraw consent, by writing to info@bulls2bear.com. We retain purchase records as required by tax law.</p>
      <h2>Cookies</h2>
      <p>We use one essential, secure cookie to keep you logged in. We do not use advertising cookies.</p>
    </Legal>
  );
}
