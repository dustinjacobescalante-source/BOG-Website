"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Trash2, Plus, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Note = {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

const supabase = createClient();

export default function AdminCommandNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadNotes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_command_notes")
      .select("*")
      .order("completed", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("load admin command notes error:", error);
      setLoading(false);
      return;
    }

    setNotes((data ?? []) as Note[]);
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote() {
    const text = input.trim();
    if (!text || saving) return;

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("admin_command_notes").insert({
      user_id: user.id,
      text,
      completed: false,
    });

    if (error) {
      console.error("add admin command note error:", error);
      setSaving(false);
      return;
    }

    setInput("");
    await loadNotes();
    setSaving(false);
  }

  async function toggleNote(note: Note) {
    const { error } = await supabase
      .from("admin_command_notes")
      .update({
        completed: !note.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);

    if (error) {
      console.error("toggle admin command note error:", error);
      return;
    }

    setNotes((prev) =>
      prev.map((item) =>
        item.id === note.id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  async function deleteNote(id: string) {
    const { error } = await supabase
      .from("admin_command_notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("delete admin command note error:", error);
      return;
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(9,11,18,0.98))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.38)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        Command Notes
      </div>

      <h3 className="mt-3 text-2xl font-black text-white">
        Operational To-Do
      </h3>

      <p className="mt-2 text-sm text-slate-300">
        Track priorities, actions, and execution tasks for platform control.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNote();
            }
          }}
          placeholder="Add a task..."
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20"
        />

        <button
          type="button"
          onClick={addNote}
          disabled={saving || !input.trim()}
          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tasks...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-sm text-slate-500">No active tasks.</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                note.completed
                  ? "border-emerald-400/20 bg-emerald-500/10 text-slate-400 line-through"
                  : "border-white/10 bg-black/30 text-white"
              }`}
            >
              <div
                onClick={() => toggleNote(note)}
                className="flex flex-1 cursor-pointer items-center gap-3"
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    note.completed ? "text-emerald-400" : "text-slate-500"
                  }`}
                />
                <span className="text-sm">{note.text}</span>
              </div>

              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className="ml-3 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}