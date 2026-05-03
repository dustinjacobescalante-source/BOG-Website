"use client";

import { useState } from "react";
import { Megaphone, Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AdminAnnouncementComposer() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      setStatus("error");
      setStatusMessage("Title and message are required.");
      return;
    }

    try {
      setSending(true);
      setStatus("");
      setStatusMessage("");

      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          linkUrl: linkUrl.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to send announcement.");
      }

      setTitle("");
      setMessage("");
      setLinkUrl("");
      setStatus("success");
      setStatusMessage("Announcement sent to active members.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to send announcement."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),linear-gradient(180deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.38)]">
      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
        <Megaphone className="h-3.5 w-3.5" />
        Admin Broadcast
      </div>

      <h3 className="mt-4 text-2xl font-black text-white">
        Send an announcement
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        Send a BOG-branded email and portal notification to all active members.
      </p>

      <form onSubmit={handleSend} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Announcement Title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Meeting Location Update"
            disabled={sending}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Message
          </label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            placeholder="Write the announcement members need to see..."
            disabled={sending}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Optional Link
          </label>
          <input
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="/portal/meetings or https://..."
            disabled={sending}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 disabled:opacity-60"
          />
        </div>

        {statusMessage ? (
          <div
            className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
              status === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending..." : "Send Announcement"}
        </button>
      </form>
    </div>
  );
}