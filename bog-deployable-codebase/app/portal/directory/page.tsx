import { Section } from '@/components/section';
import { createClient } from '@/lib/supabase/server';
import DirectoryClient from '@/components/directory/DirectoryClient';

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  rank: string | null;
  role: string | null;
  is_active: boolean | null;
};

export default async function DirectoryPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email, rank, role, is_active')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  const typedMembers: Member[] = members ?? [];

  return (
    <Section
      label="Portal"
      title="Brotherhood Directory"
      description="Connect with approved Buffalo Dogs members."
    >
      <DirectoryClient members={typedMembers} />
    </Section>
  );
}