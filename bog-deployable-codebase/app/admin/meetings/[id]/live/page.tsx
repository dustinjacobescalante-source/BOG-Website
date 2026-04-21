import { redirect } from "next/navigation";
import { ShieldCheck, Radio, Users, Video } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";

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
        description="Admin control center for this live meeting."
        actions={[
          {
            href: `/admin/meetings/${meeting.id}`,
            label: "Back to Editor",
          },
          {
            href: `/portal/meetings/${meeting.id}/live`,
            label: "Open Live Room",
          },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">

        {/* MAIN CONTROL */}
        <div className="rounded-3xl border border-cyan-400/20 bg-black/40 p-6">
          <div className="text-[10px] uppercase tracking-widest text-cyan-300">
            Admin Control
          </div>

          <h2 className="text-2xl font-bold text-white mt-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            You are running this meeting
          </h2>

          <p className="text-slate-300 mt-3">
            Use this page as your command center. Launch the live room, monitor
            activity, and control the meeting flow.
          </p>

          <a
            href={`/portal/meetings/${meeting.id}/live`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-600 transition"
          >
            <Radio className="w-4 h-4" />
            Enter Live Room
          </a>
        </div>

        {/* STATUS PANEL */}
        <div className="space-y-4">

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              Live Status
            </div>

            <div className="mt-4 space-y-3 text-white text-sm">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-400" />
                Ready to go live
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
