"use client";

type Props = {
  userId: string;
  label: string;
};

export default function DeleteUserButton({ userId, label }: Props) {
  const handleDelete = async () => {
    const confirmed = confirm(`Delete ${label}? This cannot be undone.`);

    if (!confirmed) return;

    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      alert("Failed to delete user");
      return;
    }

    alert("User deleted");

    // refresh page
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-white"
    >
      Delete
    </button>
  );
}
