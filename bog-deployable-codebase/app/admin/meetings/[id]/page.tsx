import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  Save,
  Trash2,
  Eye,
  SquarePen,
  Radio,
  MonitorPlay,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import MeetingAttachmentUpload from "@/components/meetings/MeetingAttachmentUpload";

const APP_TIME_ZONE = "America/Chicago";

function formatDateTime(date?: string | null) {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleString("en-US", {
    timeZone: APP_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusTone(status?: string | null) {
  if (status === "published") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "archived") {
    return "border-zinc-400/20 bg-zinc-500/10 text-zinc-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

export default async function AdminMeetingEditPage({
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
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: meeting } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", id)
    .single();

  if (!meeting) {
    notFound();
  }

  const statusTone = getStatusTone(meeting.status);

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Meeting Control Center"
        description="Manage this meeting, access live controls, and monitor activity."
        actions={[
          { href: "/admin/meetings", label: "Back to Meetings" },
          { href: `/portal/meetings/${meeting.id}`, label: "View in Portal" },
          { href: `/admin/meetings/${meeting.id}/live`, label: "Live Control" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">

        {/* LEFT SIDE */}
        <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            {meeting.title || "Untitled Meeting"}
          </h2>

          <p className="text-slate-300 mb-4">
            Scheduled: {formatDateTime(meeting.meeting_date)}
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}
          >
            {meeting.status ?? "draft"}
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">

          {/* LIVE CONTROL CARD */}
          <div className="rounded-[28px] border border-red-500/20 bg-black/40 p-6">
            <div className="text-[10px] uppercase tracking-widest text-red-400">
              Live Meeting Control
            </div>

            <h3 className="text-xl font-bold text-white mt-2">
              Command Center
            </h3>

            <p className="text-sm text-slate-300 mt-2">
              Launch and control the live meeting experience from here.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/admin/meetings/${meeting.id}/live`}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white font-semibold"
              >
                <Radio className="w-4 h-4" />
                Launch Admin Live Control
              </Link>

              <Link
                href={`/portal/meetings/${meeting.id}/live`}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-white"
              >
                <MonitorPlay className="w-4 h-4" />
                Open Member Live View
              </Link>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              Quick Actions
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`/admin/meetings/${meeting.id}`}
                className="flex items-center gap-2 text-white"
              >
                <SquarePen className="w-4 h-4" />
                Refresh editor
              </Link>

              <Link
                href={`/portal/meetings/${meeting.id}`}
                className="flex items-center gap-2 text-white"
              >
                <Eye className="w-4 h-4" />
                View member page
              </Link>
            </div>
          </div>

        </div>
      </section>
    </AdminPageShell>
  );
}
