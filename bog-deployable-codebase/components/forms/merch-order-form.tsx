'use client';

import { useState } from 'react';

export function MerchOrderForm({ productId, productName }: { productId?: string; productName: string }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage('');
    setError('');
    const payload = {
      product_id: productId || null,
      customer_name: String(formData.get('customer_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      size: String(formData.get('size') ?? ''),
      quantity: Number(formData.get('quantity') ?? 1),
      notes: `${productName} | ${String(formData.get('notes') ?? '')}`
    };

    const res = await fetch('/api/merch-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to place order request.');
      setLoading(false);
      return;
    }
    setMessage('Order request submitted. Leadership can follow up with pricing and payment details.');
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="customer_name" required placeholder="Name" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <input name="phone" placeholder="Phone" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="size" placeholder="Size" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
        <input name="quantity" type="number" min="1" defaultValue="1" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      </div>
      <textarea name="notes" rows={3} placeholder={`Notes for ${productName}`} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
      <button className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700" disabled={loading}>
        {loading ? 'Submitting...' : `Request ${productName}`}
      </button>
    </form>
  );
}
