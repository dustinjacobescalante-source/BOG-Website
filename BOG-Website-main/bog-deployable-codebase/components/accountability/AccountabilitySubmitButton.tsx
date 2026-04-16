'use client';

import { useFormStatus } from 'react-dom';

export default function AccountabilitySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save Accountability Entry'}
    </button>
  );
}
