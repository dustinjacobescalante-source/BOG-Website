"use client";

import { useState } from "react";
import {
  Package,
  Hash,
  Ruler,
  UserRound,
  Mail,
  Phone,
  NotebookText,
  Clock3,
  Archive,
  Trash2,
  Loader2,
} from "lucide-react";

type MerchOrderItem = {
  id: string;
  product_id: string | null;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  quantity: number | null;
  size: string | null;
  notes: string | null;
  created_at: string | null;
  product_name?: string | null;
};

type AdminMerchOrdersClientProps = {
  orders: MerchOrderItem[];
  emptyMessage?: string;
};

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

async function readApiResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return { error: "API returned invalid JSON." };
    }
  }

  return {
    error: `API returned non-JSON response (${res.status}).`,
    raw: text,
  };
}

export default function AdminMerchOrdersClient({
  orders,
  emptyMessage = "No merch order requests found.",
}: AdminMerchOrdersClientProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function reloadPage() {
    window.location.reload();
  }

  async function updateStatus(id: string, status: string) {
    try {
      setBusyId(id);
      setError("");

      const res = await fetch(`/api/admin/merch-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await readApiResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to update order.");
      }

      await reloadPage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order.");
      setBusyId(null);
    }
  }

  async function deleteOrder(id: string) {
    const confirmed = window.confirm(
      "Delete this order permanently? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      setBusyId(id);
      setError("");

      const res = await fetch(`/api/admin/merch-orders/${id}`, {
        method: "DELETE",
      });

      const data = await readApiResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete order.");
      }

      await reloadPage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order.");
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {!orders.length ? (
        <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
          {emptyMessage}
        </div>
      ) : null}

      {orders.map((order) => {
        const isBusy = busyId === order.id;
        const isArchived = (order.status ?? "").toLowerCase() === "archived";

        return (
          <div
            key={order.id}
            className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)] sm:rounded-[24px] sm:p-5"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 xl:max-w-[420px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>

                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Order Request
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black leading-tight text-white sm:text-2xl">
                  {order.customer_name || "Unnamed Customer"}
                </h3>

                <div className="mt-3 flex items-start gap-2 text-sm text-slate-300">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 break-all">
                    {order.email || "No email provided"}
                  </span>
                </div>

                {order.phone ? (
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-300">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="break-all">{order.phone}</span>
                  </div>
                ) : null}

                <div className="mt-2 flex items-start gap-2 text-sm text-slate-400">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{formatDate(order.created_at)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Package className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Product
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold leading-6 text-white">
                    {order.product_name || "Unlinked Product"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Quantity
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white">
                    {order.quantity ?? 1}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Ruler className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Size
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white">
                    {order.size || "N/A"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserRound className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Customer
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold leading-6 text-white">
                    {order.customer_name || "Unnamed"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <NotebookText className="h-4 w-4 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Notes
                </span>
              </div>
              <p className="mt-3 break-words text-sm leading-7 text-slate-300">
                {order.notes || "No notes provided."}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-6">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => updateStatus(order.id, "new")}
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-3 text-center text-sm font-semibold leading-tight text-amber-200 transition hover:bg-amber-500/20 disabled:opacity-60"
              >
                {isBusy ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Working...
                  </span>
                ) : (
                  "Set Pending"
                )}
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => updateStatus(order.id, "contacted")}
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-3 text-center text-sm font-semibold leading-tight text-blue-200 transition hover:bg-blue-500/20 disabled:opacity-60"
              >
                Processing
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => updateStatus(order.id, "fulfilled")}
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-center text-sm font-semibold leading-tight text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-60"
              >
                Fulfilled
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => updateStatus(order.id, "cancelled")}
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-center text-sm font-semibold leading-tight text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
              >
                Cancelled
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() =>
                  updateStatus(order.id, isArchived ? "new" : "archived")
                }
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center text-sm font-semibold leading-tight text-white transition hover:bg-white/[0.1] disabled:opacity-60"
              >
                <Archive className="h-4 w-4 shrink-0" />
                {isArchived ? "Restore" : "Archive"}
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => deleteOrder(order.id)}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-center text-sm font-semibold leading-tight text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
