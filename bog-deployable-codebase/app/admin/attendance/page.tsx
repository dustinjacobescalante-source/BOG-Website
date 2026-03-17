import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function saveAttendance(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const meeting_id = String(formData.get('meeting_id') ?? '');

  if (!meeting_id) return;

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, rank')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

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

  revalidatePath('/admin/attendance');
  redirect('/admin/attendance');
}

export default async function AttendancePage() {
  const supabase = await createClient();

  const [{ data: meetings }, { data: members }, { data: attendanceRows }] = await Promise.all([
    supabase
      .from('meetings')
      .select('id, title, meeting_date, status')
      .eq('status', 'published')
      .order('meeting_date', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, full_name, rank')
      .eq('is_active', true)
      .order('full_name', { ascending: true }),
    supabase
      .from('meeting_attendance')
      .select('meeting_id, user_id, attended'),
  ]);

  const attendanceMap = new Map<string, boolean>();
  for (const row of attendanceRows ?? []) {
    attendanceMap.set(`${row.meeting_id}:${row.user_id}`, row.attended);
  }

  return (
    <Section
      label="Admin"
      title="Meeting Attendance"
      description="Track member attendance for published meetings."
    >
      <div className="space-y-6">
        {meetings?.map((meeting) => (
          <Card key={meeting.id}>
            <div className="mb-4">
              <div className="text-lg font-bold text-white">{meeting.title}</div>
              <div className="text-sm text-zinc-400">
                {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleString() : 'No date'}
              </div>
            </div>

            <form action={saveAttendance} className="space-y-3">
              <input type="hidden" name="meeting_id" value={meeting.id} />

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
          </Card>
        ))}

        {!meetings?.length && (
          <Card>
            <div className="text-white font-semibold">No published meetings available</div>
            <p className="mt-2 text-sm text-zinc-400">
              Publish a meeting first, then attendance can be tracked here.
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}
