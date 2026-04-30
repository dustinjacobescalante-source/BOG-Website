"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MessageSquarePlus } from "lucide-react";

const supabase = createClient();

export default function CreateThreadForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Enter a title and discussion content.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You must be signed in.");
        return;
      }

      const { data: thread, error: threadError } = await supabase
        .from("discussion_threads")
        .insert({
          title: title.trim(),
          created_by: user.id,
        })
        .select("id")
        .single();

      if (threadError || !thread) {
        setMessage(threadError?.message || "Could not create thread.");
        return;
      }

      const { error: postError } = await supabase
        .from("discussion_posts")
        .insert({
          thread_id: thread.id,
          body: content.trim(),
          user_id: user.id,
        });

      if (postError) {
        setMessage("Thread created, but first post failed.");
        return;
      }

      await fetch("/api/discussions/notify-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: thread.id,
          title: title.trim(),
        }),
      });

      setTitle("");
      setContent("");
      setMessage("Discussion started.");

      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-7"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_25%)]" />

      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400">
            <MessageSquarePlus className="h-5 w-5" />
          </div>

          <div>
            <div className="text-lg font-semibold text-white">
              Start a Discussion
            </div>
            <div className="text-sm text-zinc-500">
              Bring something worth the room’s attention.
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Clear, direct title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40 focus:bg-black/50"
        />

        <textarea
          placeholder="Add context, ask better questions, or share something useful..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm leading-6 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40 focus:bg-black/50"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Keep it clear. Keep it useful.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Discussion"}
          </button>
        </div>

        {message && <div className="text-sm text-zinc-400">{message}</div>}
      </div>
    </form>
  );
}