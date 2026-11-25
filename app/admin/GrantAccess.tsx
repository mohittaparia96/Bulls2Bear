'use client';
import { useRouter } from 'next/navigation';
import AjaxForm from '@/components/AjaxForm';

export default function GrantAccess({ courses }: { courses: { id: string; title: string }[] }) {
  const router = useRouter();
  return (
    <div className="form-card" onSubmitCapture={() => setTimeout(() => router.refresh(), 800)}>
      <h3>Grant course access manually</h3>
      <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>For offline/bank-transfer payments, scholarships or support cases. The student must have signed up first.</p>
      <AjaxForm endpoint="/api/admin/grant" className="form-row">
        <label className="field">Student email<input name="email" type="email" required placeholder="student@email.com" /></label>
        <label className="field">Course
          <select name="courseId" required>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
        </label>
        <button className="btn btn-primary" style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>Grant access</button>
      </AjaxForm>
    </div>
  );
}
