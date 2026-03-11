'use client';

import { useState } from 'react';

export function JoinForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function onSubmit(formData: FormData) {
    setState('loading');
    setMessage('');
    const payload = {
      full_name: String(formData.get('full_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      message: String(formData.get('message') ?? ''),
      interested_in_visiting: formData.get('interested_in_visiting') === 'on'
    };

    const res = await fetch('/api/join-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setState('error');
      setMessage(data.error || 'Unable to submit request.');
      return;
    }
    setState('success');
    setMessage('Request submitted successfully.');
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="full_name" required placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="phone" placeholder="Phone" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <textarea name="message" placeholder="Why are you reaching out?" rows={4} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="interested_in_visiting" /> Interested in visiting a meeting
      </label>
      {message && <p className={`text-sm ${state === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>}
      <button className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700" disabled={state === 'loading'}>
        {state === 'loading' ? 'Sending...' : 'Submit Interest Form'}
      </button>
    </form>
  );
}
