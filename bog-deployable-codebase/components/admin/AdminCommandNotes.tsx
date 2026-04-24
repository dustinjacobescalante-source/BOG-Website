"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Trash2, Plus } from "lucide-react";

type Note = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "bog_admin_command_notes";

export default function AdminCommandNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const savedNotes = window.localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) return;

    try {
      const parsedNotes = JSON.parse(savedNotes) as Note[];
      setNotes(parsedNotes);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    if (!input.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
    };

    setNotes((prev) => [newNote, ...prev]);
    setInput("");
  }

  function toggleNote(id: string) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  }

  function deleteNote(id: string) {
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
          className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {notes.length === 0 && (
          <div className="text-sm text-slate-500">No active tasks.</div>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
              note.completed
                ? "border-emerald-400/20 bg-emerald-500/10 text-slate-400 line-through"
                : "border-white/10 bg-black/30 text-white"
            }`}
          >
            <div
              onClick={() => toggleNote(note.id)}
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
        ))}
      </div>
    </div>
  );
}
