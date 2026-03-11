import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name, email, role, rank, is_active').order('full_name');
  return <Section label="Admin" title="Manage Members" description="Assign roles, ranks, and active status."><div className="space-y-3">{data?.map((member) => <Card key={member.id}><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-white">{member.full_name}</div><div className="text-sm text-zinc-500">{member.email}</div></div><div className="text-right text-sm text-zinc-400"><div>{member.role}</div><div>{member.rank}</div><div>{member.is_active ? 'active' : 'inactive'}</div></div></div></Card>)}</div></Section>;
}
