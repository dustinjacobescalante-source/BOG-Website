import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, pack_role, rank, role, is_active')
    .eq('is_active', true)
    .order('full_name');

  return (
    <Section label="Portal" title="Member Directory" description="Profiles with rank, role, and active status.">
      <div className="space-y-3">
        {profiles?.length ? profiles.map((member) => (
          <Card key={member.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">{member.full_name}</div>
                <div className="text-sm text-zinc-500">{member.pack_role || member.role}</div>
              </div>
              <div className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-bold text-red-400">{member.rank}</div>
            </div>
          </Card>
        )) : <Card><div className="text-sm text-zinc-300">No members found.</div></Card>}
      </div>
    </Section>
  );
}
