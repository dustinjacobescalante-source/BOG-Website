import { redirect } from "next/navigation";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Clock3,
  Mail,
  CalendarDays,
  Crown,
  Save,
  Search,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, rank, is_active, created_at")
    .order("created_at", { ascending: true });

  const allMembers = members ?? [];
  const approvedCount = allMembers.filter((member) => member.is_active).length;
  const pendingCount = allMembers.filter((member) => !member.is_active).length;
  const adminCount = allMembers.filter((member) => member.role === "admin").length;
  const totalMembers = allMembers.length;

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Manage the roster. Protect the standard."
        description="Approve pending users, adjust access, assign rank, and keep the brotherhood roster clean and intentional."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/portal/directory", label: "View Member Directory" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_32%),rgba(10,14,25,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Membership Control
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Approve clearly.
              <br />
              Assign carefully.
              <br />
              Keep access tight.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your roster command table. Review member status, elevate
              responsibility where needed, and keep the platform aligned with the
              structure you want the brotherhood to reflect.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Profiles
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {totalMembers}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                All profiles currently inside the BOG system.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Approved Access
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {approvedCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Members currently cleared for portal access.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Pending Approval
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {pendingCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Profiles waiting on admin review and release.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              Priority Read
            </div>
            <h3 className="mt-3 text-2xl font-black text-white">
              {pendingCount > 0
                ? "Pending members need review."
                : "Roster is currently clear."}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {pendingCount > 0
                ? `${pendingCount} profile${pendingCount === 1 ? "" : "s"} still waiting for approval.`
                : "There are no pending member approvals at the moment."}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
              Keep approvals intentional. Access, rank, and role should reflect
              trust, ownership, and the standard of the room.
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Roster Snapshot
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Approved
                  </span>
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {approvedCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Pending
                  </span>
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {pendingCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Admins
                  </span>
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {adminCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Total
                  </span>
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {totalMembers}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Profiles
              </div>
              <div className="mt-2 text-3xl font-black text-white">{totalMembers}</div>
            </div>
            <Users className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Total users currently represented in the profile table.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Approved Access
              </div>
              <div className="mt-2 text-3xl font-black text-white">{approvedCount}</div>
            </div>
            <UserCheck className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Members currently active and cleared to enter the portal.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Pending Approval
              </div>
              <div className="mt-2 text-3xl font-black text-white">{pendingCount}</div>
            </div>
            <Clock3 className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Profiles waiting for review before access is granted.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Admin Roles
              </div>
              <div className="mt-2 text-3xl font-black text-white">{adminCount}</div>
            </div>
            <Crown className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Accounts currently carrying admin-level responsibility.
          </p>
        </div>
      </section>

      <AdminSection
        eyebrow="Member Command Table"
        title="Manage Members"
        description="Review every profile, update role and rank, approve access, and remove users when necessary."
      >
        <div className="mb-4 rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-5 w-5 text-slate-300" />
            <div>
              <div className="text-sm font-semibold text-white">
                Roster control is live
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Use the cards below to approve access, assign rank, adjust role,
                and keep the roster aligned with the structure you want.
              </p>
            </div>
          </div>
        </div>

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

          {members?.map((member) => {
            const displayName = member.full_name || "Unnamed User";
            const displayEmail = member.email || "No email available";
            const statusLabel = member.is_active ? "Approved" : "Pending";

            return (
              <form
                key={member.id}
                action="/api/admin/update-member"
                method="POST"
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-sm"
              >
                <input type="hidden" name="userId" value={member.id} />
                <input type="hidden" name="email" value={member.email ?? ""} />

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 xl:max-w-[340px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        {member.role ?? "member"}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          member.is_active
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                            : "border-amber-400/20 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {statusLabel}
                      </span>

                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        {(member.rank ?? "lone_wolf").replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mt-4 truncate text-2xl font-black text-white">
                      {displayName}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{displayEmail}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      <span>Joined {formatDate(member.created_at)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4 xl:min-w-[720px]">
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Role
                      </label>
                      <select
                        name="role"
                        defaultValue={member.role ?? "member"}
                        className="w-full rounded-2xl border border-white/10 bg-[#0e1014] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Rank
                      </label>
                      <select
                        name="rank"
                        defaultValue={member.rank ?? "lone_wolf"}
                        className="w-full rounded-2xl border border-white/10 bg-[#0e1014] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                      >
                        <option value="lone_wolf">lone wolf</option>
                        <option value="omega">omega</option>
                        <option value="alpha">alpha</option>
                        <option value="beta">beta</option>
                        <option value="gamma">gamma</option>
                        <option value="delta">delta</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Access
                      </label>
                      <select
                        name="status"
                        defaultValue={member.is_active ? "approved" : "pending"}
                        className="w-full rounded-2xl border border-white/10 bg-[#0e1014] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Actions
                      </label>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-2xl border border-[#f26a3d]/30 bg-[#f26a3d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>

                        <DeleteUserButton
                          userId={member.id}
                          label={member.full_name || member.email || "this user"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            );
          })}
        </div>
      </AdminSection>
    </AdminPageShell>
  );
}
