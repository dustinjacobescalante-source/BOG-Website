import { notFound, redirect } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function updateMeeting(id: string, formData: FormData) {
  'use server';

  const supabase = await createClient();

  const data = {
    title: String(formData.get('title') ?? '').trim(),
    meeting_date: formData.get('meeting_date') || null,
    next_meeting_date: formData.get('next_meeting_date') || null,
    status: String(formData.get('status') ?? 'draft'),

    arrival_silent_transition: formData.get('arrival_silent_transition') || null,
    opening_anchor: formData.get('opening_anchor') || null,
    code_standard_reaffirmation: formData.get('code_standard_reaffirmation') || null,
    ownership_round: formData.get('ownership_round') || null,
    council_reflection: formData.get('council_reflection') || null,
    practical_alignment_block: formData.get('practical_alignment_block') || null,
    open_business: formData.get('open_business') || null,
    commitment_declarations: formData.get('commitment_declarations') || null,
    closing_anchor: formData.get('closing_anchor') || null,
    post_meeting_notes: formData.get('post_meeting_notes') || null,
  };

  const { error } = await supabase
    .from('meetings')
    .update(data)
    .eq('id', id);

 if (error) {
  console.error('update error:', error);
  throw new Error(error.message);
}

  revalidatePath('/admin/meetings');
  redirect('/admin/meetings');
}

export default async function AdminMeetingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single();

  if (!meeting) {
    notFound();
  }

  return (
    <Section label="Admin" title="Edit Meeting" description="Update meeting details.">
      <Card>
        <form action={updateMeeting.bind(null, id)} className="space-y-4">

          <input name="title" defaultValue={meeting.title} className="w-full p-3 rounded bg-black/40 text-white" />

          <textarea name="arrival_silent_transition" defaultValue={meeting.arrival_silent_transition} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="opening_anchor" defaultValue={meeting.opening_anchor} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="code_standard_reaffirmation" defaultValue={meeting.code_standard_reaffirmation} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="ownership_round" defaultValue={meeting.ownership_round} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="council_reflection" defaultValue={meeting.council_reflection} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="practical_alignment_block" defaultValue={meeting.practical_alignment_block} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="open_business" defaultValue={meeting.open_business} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="commitment_declarations" defaultValue={meeting.commitment_declarations} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="closing_anchor" defaultValue={meeting.closing_anchor} className="w-full p-3 rounded bg-black/40 text-white" />
          <textarea name="post_meeting_notes" defaultValue={meeting.post_meeting_notes} className="w-full p-3 rounded bg-black/40 text-white" />

          <input type="datetime-local" name="meeting_date" defaultValue={meeting.meeting_date ?? ''} className="w-full p-3 rounded bg-black/40 text-white" />
          <input type="datetime-local" name="next_meeting_date" defaultValue={meeting.next_meeting_date ?? ''} className="w-full p-3 rounded bg-black/40 text-white" />

          <select name="status" defaultValue={meeting.status} className="w-full p-3 rounded bg-black/40 text-white">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>

          <button className="bg-red-600 px-4 py-2 rounded text-white">Update Meeting</button>
        </form>
      </Card>
    </Section>
  );
}
