import { redirect } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function saveMeeting(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '');
  const location = String(formData.get('location') ?? '');
  const meeting_date = String(formData.get('meeting_date') ?? '');
  const status = String(formData.get('status') ?? 'draft');

  await supabase.from('meetings').insert({
    title,
    description,
    location,
    meeting_date,
    status,
  });

  revalidatePath('/admin/meetings');
  revalidatePath('/portal');
  revalidatePath('/portal/meetings');
}

async function deleteMeeting(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const id = String(formData.get('id') ?? '');

  if (!id) return;

  await supabase.from('meetings').delete().eq('id', id);

  revalidatePath('/admin/meetings');
  revalidatePath('/portal');
  revalidatePath('/portal/meetings');
}

async function saveAttendance(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const meeting_id = String(formData.get('meeting_id') ?? '');

  if (!meeting_id) return;

  const { data: members } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_active', true);

  for (const member of members ?? []) {
    const attended = formData.get(`attended_${member.id}`) === 'on';

    const { data: existing } = await supabase
      .from('meeting_attendance')
      .select('id')
      .eq('meeting_id', meeting_id)
      .eq('user_id', member.id)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from('meeting_attendance')
        .update({
          attended,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('meeting_attendance')
        .insert({
          meeting_id,
          user_id: member.id,
          attended,
        });
    }
  }

revalidatePath('/admin/meetings');
revalidatePath('/portal');
revalidatePath('/portal/meetings');

redirect('/admin/meetings');
}

export default async function AdminMeetingsPage() {
  const supabase = await createClient();

  const [{ data: meetings }, { data: members }] = await Promise.all([
    supabase.from('meetings').select('*').order('meeting_date', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, full_name, email, rank, role')
      .eq('is_active', true)
      .order('full_name', { ascending: true }),
  ]);

  const attendanceRows = meetings?.length
    ? await supabase
        .from('meeting_attendance')
        .select('id, meeting_id, user_id, attended')
        .in('meeting_id', meetings.map((m) => m.id))
    : { data: [] as any[] };

  const attendanceMap = new Map<string, boolean>();
  for (const row of attendanceRows.data ?? []) {
    attendanceMap.set(`${row.meeting_id}:${row.user_id}`, row.attended);
  }

  return (
    <Section
      label="Admin"
      title="Manage Meetings"
      description="Create, publish, and track attendance for meetings."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-4 text-lg font-bold text-white">Create New Meeting</div>

          <form action={saveMeeting} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Title</label>
              <input
                name="title"
                placeholder="Brotherhood Meeting"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Description / Agenda</label>
              <textarea
                name="description"
                placeholder="Agenda, discussion topics, notes..."
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Location</label>
              <input
                name="location"
                placeholder="TBD"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Meeting Date & Time</label>
              <input
                type="datetime-local"
                name="meeting_date"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Status</label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Save Meeting
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-bold text-white">Existing Meetings</div>

          <div className="space-y-4">
            {meetings?.map((meeting) => (
              <div key={meeting.id} className="rounded-2xl border border-white/10 p-4">
                <div className="font-semibold text-white">{meeting.title}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleString() : 'No date'}
                </div>
                <div className="mt-1 text-sm text-zinc-500">{meeting.location || 'No location set'}</div>
                <div className="mt-2 text-xs text-zinc-400">Status: {meeting.status}</div>
                {meeting.description && (
                  <p className="mt-3 text-sm text-zinc-300">{meeting.description}</p>
                )}

                <form action={saveAttendance} className="mt-4 space-y-3">
                  <input type="hidden" name="meeting_id" value={meeting.id} />
                  <div className="text-sm font-semibold text-white">Attendance</div>

                  {(members ?? []).map((member) => {
                    const checked = attendanceMap.get(`${meeting.id}:${member.id}`) ?? false;
                    return (
                      <label key={member.id} className="flex items-center gap-3 text-sm text-zinc-300">
                        <input
                          type="checkbox"
                          name={`attended_${member.id}`}
                          defaultChecked={checked}
                        />
                        <span>
                          {member.full_name} ({member.rank || 'omega'})
                        </span>
                      </label>
                    );
                  })}

                 <button
  type="submit"
  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
>
  Save Attendance
</button>
                </form>

                <form action={deleteMeeting} className="mt-4">
                  <input type="hidden" name="id" value={meeting.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete Meeting
                  </button>
                </form>
              </div>
            ))}

            {!meetings?.length && (
              <div className="text-sm text-zinc-400">No meetings created yet.</div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}
