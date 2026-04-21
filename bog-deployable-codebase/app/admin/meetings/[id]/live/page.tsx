import { redirect } from "next/navigation";
import { Video, Users, Radio, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import LiveMeetingRoom from "@/components/meetings/LiveMeetingRoom";

export default async function AdminLiveMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: meeting } = await supabase
    .from("meetings")
    .select("id, title, status")
    .eq("id", id)
    .single();

  if (!meeting) {
    redirect("/admin/meetings");
  }

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Live Meeting Command"
        title={meeting.title || "Live Meeting"}
        description="You are now in control of the live meeting room."
        actions={[
          {
            href: `/admin/meetings/${meeting.id}`,
            label: "Back to Editor",
          },
          {
            href: `/portal/meetings/${meeting.id}/live`,
            label: "Open Member View",
          },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.7fr] gap-6">

        {/* LIVE ROOM */}
        <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
          <LiveMeetingRoom
            meetingId={meeting.id}
            userName={profile.full_name || "Admin"}
            isAdmin
          />
        </div>

        {/* CONTROL PANEL */}
        <div className="space-y-4">

          <div className="rounded-3xl border border-red-500/20 bg-black/40 p-6">
            <div className="text-[10px] uppercase tracking-widest text-red-400">
              Admin Status
            </div>

            <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              You are controlling this meeting
            </h3>

            <p className="text-sm text-slate-300 mt-2">
              You have full control over audio, video, and room presence.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              Live Indicators
            </div>

            <div className="mt-4 space-y-3 text-sm text-white">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-400" />
                Room Active
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members can join
              </div>

              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Audio / Video enabled
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminPageShell>
  );
}
