'use client';

import { useState } from 'react';

export function ScholarshipForm() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage('');
    setError('');
    const payload = {
      student_name: String(formData.get('student_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      school_name: String(formData.get('school_name') ?? ''),
      gpa: Number(formData.get('gpa') ?? 0),
      intended_path: String(formData.get('intended_path') ?? ''),
      activities: String(formData.get('activities') ?? ''),
      essay_prompt: String(formData.get('essay_prompt') ?? '')
    };

    const res = await fetch('/api/scholarship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to submit application.');
      setLoading(false);
      return;
    }
    setMessage('Application submitted. Upload support files can be connected next to Supabase Storage.');
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="student_name" required placeholder="Student name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="phone" placeholder="Phone" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="school_name" placeholder="School" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="gpa" type="number" step="0.01" placeholder="GPA" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="intended_path" placeholder="College or trade school path" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <select name="essay_prompt" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
        <option value="">Select essay prompt</option>
        <option value="A">Prompt A</option>
        <option value="B">Prompt B</option>
        <option value="C">Prompt C</option>
      </select>
      <textarea name="activities" rows={4} placeholder="Activities, leadership, and work experience" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
      <button className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
