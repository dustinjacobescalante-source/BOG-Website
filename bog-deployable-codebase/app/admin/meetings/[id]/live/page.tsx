import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

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
    .select("id, title")
    .eq("id", id)
    .single();

  if (!meeting) {
    redirect("/admin/meetings");
  }

  const cookieHeader = requestHeadersToCookieString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/livekit/token`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        meetingId: meeting.id,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to load LiveKit token: ${res.status} ${errorText}`
    );
  }

  const tokenData = await res.json();

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Live Meeting Command"
        title={meeting.title || "Live Meeting"}
        description="You are running this meeting. Stay sharp."
        actions={[
          {
            href: `/admin/meetings/${meeting.id}`,
            label: "Back to Editor",
          },
        ]}
      />

      <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-black/40 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-300">
          <ShieldCheck className="h-4 w-4" />
          Admin Live Room
        </div>

        <LiveMeetingRoom tokenData={tokenData} />
      </div>
    </AdminPageShell>
  );
}

import { cookies } from "next/headers";

function requestHeadersToCookieString() {
  const cookieStore = cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}
