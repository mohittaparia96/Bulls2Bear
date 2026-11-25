import 'server-only';
import nodemailer from 'nodemailer';

const configured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_PASS);

/** Sends an email via SMTP (e.g. info@bulls2bear.com on GoDaddy / Microsoft 365). In dev, logs to console. */
export async function sendMail(to: string, subject: string, html: string) {
  if (!configured()) {
    console.log(`\n[mail:dev] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n`);
    return;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM || 'bulls2bear <info@bulls2bear.com>', to, subject, html });
  } catch (e) {
    console.error('[mail] failed', e);
  }
}

export const emailLayout = (title: string, body: string) => `
<div style="background:#05070a;padding:32px;font-family:Arial,sans-serif;color:#e5e7eb">
  <div style="max-width:560px;margin:auto;background:#0d1117;border:1px solid #1f2937;border-radius:16px;padding:32px">
    <h2 style="margin:0 0 16px;color:#fff">${title}</h2>
    ${body}
    <p style="margin-top:32px;font-size:12px;color:#6b7280">bulls2bear · Trade smart. Learn. Grow.<br/>info@bulls2bear.com</p>
  </div>
</div>`;
