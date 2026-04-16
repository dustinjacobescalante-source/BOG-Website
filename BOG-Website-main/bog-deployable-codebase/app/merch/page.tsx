import Image from "next/image";
import {
  ShoppingBag,
  ShieldCheck,
  Shirt,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

import { Section } from "@/components/section";
import { Card } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { MerchOrderForm } from "@/components/forms/merch-order-form";

type MerchItem = {
  id?: string;
  name: string;
  description: string | null;
};

export default async function Page() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("merch_products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const fallback: MerchItem[] = [
    {
      id: undefined,
      name: "BOG Black Tee",
      description: "Front chest logo + full back graphic",
    },
    {
      id: undefined,
      name: "BOG Puff Hat",
      description: "3D puff embroidery",
    },
  ];

  const items: MerchItem[] =
    products?.length
      ? products.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }))
      : fallback;

  return (
    <Section
      label="Merch"
      title="Brotherhood Merch"
      description="A premium public merch page backed by products and order submissions in Supabase."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.10),transparent_24%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Brotherhood Store
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
                  Wear the standard.
                  <br />
                  Carry the mark.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Brotherhood merch should feel clean, strong, and intentional.
                  These pieces represent the identity, discipline, and standard
                  behind BOG — not just a logo on fabric.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Product Standard
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Clean
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Built to match the Brotherhood look without unnecessary noise.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Ordering
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Direct
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Submit the form, choose the product, and keep the request clean.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Identity
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      BOG
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Every item should reflect Brotherhood discipline and presence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Featured Mockup
              </div>

              <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <div className="relative min-h-[340px] overflow-hidden rounded-[22px] border border-white/10 bg-black/30 sm:min-h-[420px]">
                  <Image
                    src="/assets/merch-mockup.png"
                    alt="BOG merch mockup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_38%),rgba(16,18,28,0.92)] p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                  Order Flow
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  Submit clean requests.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Choose the product, enter the order details clearly, and send
                  the request through the system. Keep sizing, quantity, and
                  notes accurate.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Order below
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card>
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Brotherhood Standard
                </div>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                  Merch Ordering Notes
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Brotherhood merch should be requested with clear information
                  and purpose. Make sure your details are accurate before
                  submitting your order.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                      <Shirt className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">
                        Product-first ordering
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Select the item you want and make sure your request
                        matches the correct product.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                      <PackageCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">
                        Clean details matter
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Enter size, quantity, and notes clearly so fulfillment
                        can stay organized.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Reminder
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Brotherhood gear should feel intentional. Order what you need,
                    keep the request sharp, and represent the standard well.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-5">
            {items.map((item) => (
              <Card key={item.name}>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                      <ShoppingBag className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-xl font-black text-white">
                        {item.name}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {item.description || "Brotherhood merch item available for order."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
                    <MerchOrderForm
                      productId={item.id}
                      productName={item.name}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
