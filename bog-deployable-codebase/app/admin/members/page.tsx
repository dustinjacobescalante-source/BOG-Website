import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function updateMember(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const id = String(formData.get('id') ?? '');
  const role = String(formData.get('role') ?? 'member');
  const rank = String(formData.get('rank') ?? 'omega');
  const is_active = formData.get('is_active') === 'true';

  await supabase
    .from('profiles')
    .update({
      role,
      rank,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  revalidatePath('/admin/members');
}

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, rank, is_active')
    .order('created_at', { ascending: false });

  return (
   <Section
  label="Admin"
  title="ADMIN MEMBERS TEST PAGE"
  description="If you can see this page the admin route is working."
>
      <div className="space-y-4">
        {data?.map((member) => (
          <Card key={member.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="font-semibold text-white">
                  {member.full_name || 'Unnamed member'}
                </div>
                <div className="text-sm text-zinc-500">{member.email}</div>
                <div className="mt-2 text-xs text-zinc-400">
                  Status:{' '}
                  <span className={member.is_active ? 'text-emerald-400' : 'text-amber-400'}>
                    {member.is_active ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <form action={updateMember} className="grid gap-3 sm:grid-cols-4 lg:min-w-[700px]">
                <input type="hidden" name="id" value={member.id} />

                <select
                  name="role"
                  defaultValue={member.role ?? 'member'}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                >
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>

                <select
                  name="rank"
                  defaultValue={member.rank ?? 'omega'}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                >
                  <option value="omega">omega</option>
                  <option value="alpha">alpha</option>
                  <option value="beta">beta</option>
                  <option value="gamma">gamma</option>
                  <option value="delta">delta</option>
                </select>

                <select
                  name="is_active"
                  defaultValue={member.is_active ? 'true' : 'false'}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                >
                  <option value="false">pending</option>
                  <option value="true">approved</option>
                </select>

                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Save
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
