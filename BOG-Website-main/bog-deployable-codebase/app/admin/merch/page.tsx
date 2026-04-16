import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase.from('merch_products').select('id, name, price_text, is_active').order('sort_order'),
    supabase.from('merch_orders').select('id, customer_name, email, status, quantity, size, created_at').order('created_at', { ascending: false })
  ]);
  return <Section label="Admin" title="Manage Merch" description="Edit products and track order requests."><div className="grid gap-6 lg:grid-cols-2"><Card><div className="text-lg font-bold text-white">Products</div><div className="mt-4 space-y-3">{products?.map((p) => <div key={p.id} className="rounded-2xl border border-white/10 bg-black/40 p-4"><div className="font-semibold text-white">{p.name}</div><div className="text-sm text-zinc-500">{p.price_text || 'Set by admin'} • {p.is_active ? 'active' : 'inactive'}</div></div>)}</div></Card><Card><div className="text-lg font-bold text-white">Orders</div><div className="mt-4 space-y-3">{orders?.map((o) => <div key={o.id} className="rounded-2xl border border-white/10 bg-black/40 p-4"><div className="font-semibold text-white">{o.customer_name}</div><div className="text-sm text-zinc-500">{o.email} • qty {o.quantity} • {o.size || 'n/a'}</div><div className="mt-2 text-xs text-red-400">{o.status}</div></div>)}</div></Card></div></Section>;
}
