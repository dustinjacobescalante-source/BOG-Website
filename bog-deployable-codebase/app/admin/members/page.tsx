import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, rank, is_active")
    .order("created_at", { ascending: true });

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Admin"
        title="Manage Members"
        description="Assign roles, ranks, and active status."
      />

      <AdminSection
        eyebrow="Members"
        title="Member Directory"
        description="Update each member and prepare for delete actions."
      >
        <div className="space-y-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              Failed to load members.
            </div>
          ) : null}

          {!error && (!members || members.length === 0) ? (
            <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
              No members found.
            </div>
          ) : null}

          {members?.map((member) => (
            <form
              key={member.id}
              className="rounded-[28px] border border-white/10 bg-[#0b0d11]/95 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold text-white">
                    {member.full_name || "Unnamed User"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{member.email}</p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Status:{" "}
                    <span
                      className={
                        member.is_active
                          ? "font-semibold text-emerald-400"
                          : "font-semibold text-amber-400"
                      }
                    >
                      {member.is_active ? "Approved" : "Pending"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4 xl:min-w-[700px]">
                  <select
                    name="role"
                    defaultValue={member.role ?? "member"}
                    className="rounded-xl border border-white/10 bg-[#0e1014] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>

                  <select
                    name="rank"
                    defaultValue={member.rank ?? "omega"}
                    className="rounded-xl border border-white/10 bg-[#0e1014] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="omega">omega</option>
                    <option value="alpha">alpha</option>
                    <option value="beta">beta</option>
                    <option value="gamma">gamma</option>
                    <option value="delta">delta</option>
                  </select>

                  <select
                    name="is_active"
                    defaultValue={member.is_active ? "approved" : "pending"}
                    className="rounded-xl border border-white/10 bg-[#0e1014] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                  </select>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-xl bg-[#f26a3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ))}
        </div>
      </AdminSection>
    </AdminPageShell>
  );
}
