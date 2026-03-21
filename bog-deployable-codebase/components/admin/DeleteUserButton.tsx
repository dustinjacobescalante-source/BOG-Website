"use client";

export default function DeleteUserButton() {
  return (
    <button
      type="button"
      onClick={() => alert("DELETE BUTTON IS CONNECTED")}
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-white"
    >
      CLICK TEST
    </button>
  );
}
