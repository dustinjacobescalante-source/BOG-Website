import Image from 'next/image';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { MerchOrderForm } from '@/components/forms/merch-order-form';

export default async function Page() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('merch_products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const fallback = [
    { id: undefined, name: 'BOG Black Tee', description: 'Front chest logo + full back graphic' },
    { id: undefined, name: 'BOG Puff Hat', description: '3D puff embroidery' }
  ];

  const items = products?.length ? products : fallback;

  return (
    <Section label="Merch" title="Merch Ordering" description="A public merch page backed by products and order submissions in Supabase.">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-4">
          <div className="relative min-h-[420px] overflow-hidden rounded-[24px] border border-white/10">
            <Image src="/assets/merch-mockup.png" alt="BOG merch mockup" fill className="object-cover" />
          </div>
        </Card>
        <div className="grid gap-5">
          {items.map((item) => (
            <Card key={item.name}>
              <div className="text-lg font-bold text-white">{item.name}</div>
              <p className="mt-3 text-sm text-zinc-400">{item.description}</p>
              <div className="mt-4">
                <MerchOrderForm productId={(item as { id?: string }).id} productName={item.name} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
