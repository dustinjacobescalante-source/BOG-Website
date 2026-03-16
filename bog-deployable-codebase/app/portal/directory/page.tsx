import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function DirectoryPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email, rank, role, is_active')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  return (
    <Section
      label="Portal"
      title="Brotherhood Directory"
      description="Connect with approved Buffalo Dogs members."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members?.map((member) => (
          <Card key={member.id}>
            <div className="space-y-2">
              <div className="text-lg font-bold text-white">
                {member.full_name || 'Unnamed Member'}
              </div>

              <div className="text-sm text-zinc-400">{member.email}</div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                  Rank: {member.rank || 'omega'}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                  Role: {member.role || 'member'}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {!members?.length && (
          <Card>
            <div className="text-white font-semibold">No approved members yet</div>
            <p className="mt-2 text-sm text-zinc-400">
              Once approved members join, they will appear here.
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}
