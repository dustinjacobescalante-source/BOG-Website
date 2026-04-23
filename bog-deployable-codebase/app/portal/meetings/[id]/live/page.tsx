import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import LiveMeetingRoom from "@/components/meetings/LiveMeetingRoom";
import PortalShell from "@/components/portal/PortalShell";

export default async function PortalMeetingLivePage({
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
    .select("is_active, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect("/pending");
  }

  const { data: meeting } = await supabase
    .from("meetings")
    .select("id, title, status")
    .eq("id", id)
    .single();

  if (!meeting) {
    redirect("/portal/meetings");
  }

  if (meeting.status !== "published") {
    redirect(`/portal/meetings/${meeting.id}`);
  }

  return (
    <PortalShell>
      <section className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_34%),rgba(10,14,25,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Live Meeting
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {meeting.title || "Live Meeting"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            You are entering the live meeting room. Make sure your camera and mic
            settings are ready before you begin.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[rgba(10,14,25,0.92)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
          <LiveMeetingRoom meetingId={meeting.id} isAdmin={false} />
        </div>
      </section>
    </PortalShell>
  );
}
