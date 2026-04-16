import { redirect } from "next/navigation";
import {
  ShoppingBag,
  Package,
  ShieldCheck,
  Mail,
  Phone,
  BadgeCheck,
  Archive,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminMerchOrdersClient from "@/components/admin/AdminMerchOrdersClient";

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusTone(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "fulfilled") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (value === "cancelled" || value === "canceled") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (value === "paid") {
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-300";
  }

  if (value === "contacted") {
    return "border-blue-400/20 bg-blue-500/10 text-blue-300";
  }

  if (value === "archived") {
    return "border-slate-400/20 bg-slate-500/10 text-slate-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function getStatusLabel(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "fulfilled") return "Fulfilled";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  if (value === "paid") return "Paid";
  if (value === "contacted") return "Processing";
  if (value === "archived") return "Archived";
  return "Pending";
}

export default async function AdminMerchPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const [{ data: products, error: productsError }, { data: orders, error: ordersError }] =
    await Promise.all([
      supabase
        .from("merch_products")
        .select("id, name, description, price_text, is_active, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("merch_orders")
        .select(
          `
          id,
          product_id,
          customer_name,
          email,
          phone,
          status,
          quantity,
          size,
          notes,
          created_at
        `
        )
        .order("created_at", { ascending: false }),
    ]);

  const allProducts = products ?? [];
  const allOrders = orders ?? [];

  const productNameById = new Map(
    allProducts.map((product) => [product.id, product.name])
  );

  const activeProducts = allProducts.filter((p) => p.is_active).length;

  const activeOrders = allOrders.filter(
    (order) => (order.status ?? "").toLowerCase() !== "archived"
  );

  const archivedOrders = allOrders.filter(
    (order) => (order.status ?? "").toLowerCase() === "archived"
  );

  const pendingOrders = activeOrders.filter((o) => {
    const value = (o.status ?? "").toLowerCase();
    return value === "new";
  }).length;

  const processingOrders = activeOrders.filter((o) => {
    const value = (o.status ?? "").toLowerCase();
    return value === "contacted";
  }).length;

  const paidOrders = activeOrders.filter((o) => {
    const value = (o.status ?? "").toLowerCase();
    return value === "paid";
  }).length;

  const fulfilledOrders = activeOrders.filter((o) => {
    const value = (o.status ?? "").toLowerCase();
    return value === "fulfilled";
  }).length;

  const latestOrder = activeOrders[0] ?? null;

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Manage merch. Track requests clearly."
        description="Monitor active merch products, review incoming order requests, update status, archive older items, and delete records when needed."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/merch", label: "View Public Merch Page" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_32%),rgba(10,14,25,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Merch Command
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Keep products clean.
              <br />
              Track orders clearly.
              <br />
              Stay organized.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your merch operations board. Manage active products,
              verify incoming requests, and keep order fulfillment controlled
              and easy to review.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Products
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {allProducts.length}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Product records currently stored in merch management.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Active Products
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {activeProducts}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Products currently visible on the public merch page.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Pending Orders
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {pendingOrders}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                New order requests waiting for your first follow-up.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Processing
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {processingOrders}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Orders you have already contacted and are working through.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Paid / Fulfilled
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {paidOrders + fulfilledOrders}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Orders already paid or fully closed out.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              Priority Read
            </div>
            <h3 className="mt-3 text-2xl font-black text-white">
              {pendingOrders > 0
                ? "Pending merch requests need review."
                : "Merch request queue is currently clear."}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {pendingOrders > 0
                ? `${pendingOrders} merch order request${
                    pendingOrders === 1 ? "" : "s"
                  } still waiting for admin follow-up.`
                : "There are no pending merch order requests waiting for action."}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
              Archiving now moves an order out of the active queue and into its
              own archived section below, so the main board stays cleaner.
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Latest Active Order
            </div>

            {latestOrder ? (
              <>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {latestOrder.customer_name || "Unnamed Customer"}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{latestOrder.email || "No email provided"}</span>
                </div>

                {latestOrder.phone ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{latestOrder.phone}</span>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                      latestOrder.status
                    )}`}
                  >
                    {getStatusLabel(latestOrder.status)}
                  </span>

                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Product:{" "}
                    {latestOrder.product_id
                      ? productNameById.get(latestOrder.product_id) ?? "Linked Product"
                      : "Unlinked Product"}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Submitted
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {formatDate(latestOrder.created_at)}
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-300">
                No active merch order requests yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSection
          eyebrow="Merch Catalog"
          title="Products"
          description="Review the active merch catalog and confirm what is currently available on the public page."
        >
          {productsError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              Failed to load merch products.
            </div>
          ) : null}

          {!productsError && !allProducts.length ? (
            <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
              No merch products found.
            </div>
          ) : null}

          <div className="space-y-4">
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          product.is_active
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                            : "border-slate-400/20 bg-slate-500/10 text-slate-300"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>

                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Catalog Item
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-white">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {product.description || "No product description added yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:min-w-[220px]">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Price
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {product.price_text || "Set by admin"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Package className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Sort Order
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {product.sort_order ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-blue-400/15 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-blue-300" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Catalog visibility check
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Only active products appear on the public merch page. Inactive
                  items stay in admin for control and future use.
                </p>
              </div>
            </div>
          </div>
        </AdminSection>

        <div className="space-y-6">
          <AdminSection
            eyebrow="Order Queue"
            title="Active Merch Orders"
            description="Review incoming merch requests, update order status, and keep the active queue clean."
          >
            {ordersError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                Failed to load merch orders.
              </div>
            ) : null}

            {!ordersError ? (
              <AdminMerchOrdersClient
                orders={activeOrders.map((order) => ({
                  id: order.id,
                  product_id: order.product_id,
                  customer_name: order.customer_name,
                  email: order.email,
                  phone: order.phone,
                  status: order.status,
                  quantity: order.quantity,
                  size: order.size,
                  notes: order.notes,
                  created_at: order.created_at,
                  product_name: order.product_id
                    ? productNameById.get(order.product_id) ?? "Linked Product"
                    : "Unlinked Product",
                }))}
                emptyMessage="No active merch order requests found."
              />
            ) : null}

            <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Active merch queue is live
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Public merch requests appear here as they are submitted
                    through the site form.
                  </p>
                </div>
              </div>
            </div>
          </AdminSection>

          <AdminSection
            eyebrow="Archived Orders"
            title="Archived Merch Orders"
            description="These are orders removed from the active queue. Restore them if needed, or delete them permanently."
          >
            <div className="mb-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Archive className="h-4 w-4" />
                <span className="text-sm font-semibold text-white">
                  Archived Count: {archivedOrders.length}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Archiving moves an order out of the working queue without
                deleting it.
              </p>
            </div>

            {!ordersError ? (
              <AdminMerchOrdersClient
                orders={archivedOrders.map((order) => ({
                  id: order.id,
                  product_id: order.product_id,
                  customer_name: order.customer_name,
                  email: order.email,
                  phone: order.phone,
                  status: order.status,
                  quantity: order.quantity,
                  size: order.size,
                  notes: order.notes,
                  created_at: order.created_at,
                  product_name: order.product_id
                    ? productNameById.get(order.product_id) ?? "Linked Product"
                    : "Unlinked Product",
                }))}
                emptyMessage="No archived merch orders found."
              />
            ) : null}
          </AdminSection>
        </div>
      </section>
    </AdminPageShell>
  );
}
