import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, rank, is_active, created_at")
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
        description="Update each member and manage account access."
      >
        <div className="space-y-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              Failed to load members.
            </div>
          ) : null}

          {members?.map((member) => (
            <div
              key={member.id}
              className="rounded-[28px] border border-white/10 bg-[#0b0d11]/95 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold text-white">
                    {member.full_name || "Unnamed User"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{member.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-[#f26a3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Save
                  </button>

                  <DeleteUserButton
  userId={member.id}
  label={member.full_name || member.email || "this user"}
/> />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminSection>
    </AdminPageShell>
  );
}
