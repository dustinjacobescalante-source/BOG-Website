import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('scholarship_applications').select('id, student_name, email, status, created_at').order('created_at', { ascending: false });
  return <Section label="Admin" title="Manage Scholarship" description="Review scholarship submissions and update statuses."><div className="space-y-3">{data?.map((app) => <Card key={app.id}><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-white">{app.student_name}</div><div className="text-sm text-zinc-500">{app.email}</div></div><div className="text-right"><div className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-bold text-red-400">{app.status}</div><div className="mt-2 text-xs text-zinc-500">{new Date(app.created_at).toLocaleDateString()}</div></div></div></Card>)}</div></Section>;
}
