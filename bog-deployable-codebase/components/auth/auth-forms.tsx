'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'sign-in' | 'sign-up' | 'reset-password';

export function AuthForm({ mode }: { mode: Mode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const fullName = String(formData.get('full_name') ?? '');

    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
       window.location.href = '/portal';
return;
      }

      if (mode === 'sign-up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage('Account created. Check your email for confirmation if email verification is enabled.');
      }

      if (mode === 'reset-password') {
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/sign-in` : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        setMessage('Password reset email sent.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      {mode === 'sign-up' && (
        <input
          name="full_name"
          placeholder="Full name"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
        required
      />
      {mode !== 'reset-password' && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
          required
          minLength={8}
        />
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
      >
        {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : mode === 'sign-up' ? 'Create Account' : 'Send Reset Email'}
      </button>
    </form>
  );
}
