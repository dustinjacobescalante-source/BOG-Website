"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();

  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!body.trim()) {
      setMessage("Please write a reply before posting.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      setMessageType("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setMessage("You must be signed in to reply.");
        setMessageType("error");
        return;
      }

      const { error } = await supabase.from("discussion_posts").insert({
        thread_id: threadId,
        body: body.trim(),
        user_id: user.id,
      });

      if (error) {
        setMessage(error.message || "Could not post reply.");
        setMessageType("error");
        return;
      }

      await fetch("/api/discussions/notify-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          preview: body.trim().slice(0, 160),
        }),
      });

      setBody("");
      setMessage("Reply posted.");
      setMessageType("success");

      setTimeout(() => {
        router.refresh();
      }, 250);
    } catch {
      setMessage("Something went wrong while posting your reply.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="Add your perspective..."
        className="w-full rounded-[24px] border border-white/10 bg-black/35 px-4 py-4 text-sm leading-6 text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40 focus:bg-black/45"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post Reply"}
        </button>

        {message ? (
          <div
            className={`text-sm ${
              messageType === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}