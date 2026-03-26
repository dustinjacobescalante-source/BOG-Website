import { createServerClient } from '@/lib/supabase/server';
import MeetingAttachmentUpload from '@/components/meetings/MeetingAttachmentUpload';

export default async function MeetingPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  // ✅ Get meeting data
  const { data: meeting, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !meeting) {
    return <div className="p-6 text-white">Meeting not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 MEETING HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {meeting.title}
        </h1>
        <p className="text-zinc-400">
          {meeting.description || 'No description'}
        </p>
      </div>

      {/* 🔥 YOUR AGENDA CONTENT (restore this if you had sections) */}
      <div className="rounded-xl border border-white/10 p-4 bg-black/20">
        <h2 className="text-lg font-semibold text-white mb-2">
          Agenda
        </h2>

        <p className="text-zinc-300">
          {meeting.agenda || 'No agenda yet.'}
        </p>
      </div>

      {/* 🔥 ATTACHMENTS (your new feature) */}
      <MeetingAttachmentUpload meetingId={params.id} />
    </div>
  );
}
