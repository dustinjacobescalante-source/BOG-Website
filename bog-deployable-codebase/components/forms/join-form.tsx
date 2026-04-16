"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Phone, User, MessageSquare } from "lucide-react";

export function JoinForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setState("loading");
    setMessage("");

    const payload = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      interested_in_visiting: formData.get("interested_in_visiting") === "on",
    };

    const res = await fetch("/api/join-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setState("error");
      setMessage(data.error || "Unable to submit request.");
      return;
    }

    setState("success");
    setMessage("Request submitted successfully.");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              name="full_name"
              required
              placeholder="Full name"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-11 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:bg-black/55"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-11 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:bg-black/55"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Phone
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              name="phone"
              placeholder="Phone"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-11 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:bg-black/55"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Why Are You Reaching Out?
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-zinc-500" />
            <textarea
              name="message"
              placeholder="Tell us why you are reaching out and what kind of step you are looking to take."
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-11 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:bg-black/55"
            />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="interested_in_visiting"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40"
        />
        <span>
          I am interested in visiting a meeting before moving further.
        </span>
      </label>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state === "success"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {state === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : null}
            <span>{message}</span>
          </div>
        </div>
      )}

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(185,28,28,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={state === "loading"}
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit Interest Form"
        )}
      </button>
    </form>
  );
}
