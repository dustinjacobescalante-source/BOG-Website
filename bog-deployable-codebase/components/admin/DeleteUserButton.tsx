"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteUserButtonProps = {
  userId: string;
  label: string;
};

export default function DeleteUserButton({
  userId,
  label,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${label}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Delete failed.");
        return;
      }

      alert("User deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Something went wrong while deleting the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
