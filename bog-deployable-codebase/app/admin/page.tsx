import { Section } from "@/components/section";
import { Card } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export default async function Page() {
  await requireAdmin();

  const supabase = await createClient();

  const [
    { count: members },
    { count: meetings },
    { count: scholarship },
    { count: orders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("meetings").select("*", { count: "exact", head: true }),
    supabase.from("scholarship_applications").select("*", { count: "exact", head: true }),
    supabase.from("merch_orders").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    ["Active Members", String(members ?? 0)],
    ["Meetings", String(meetings ?? 0)],
    ["Scholarship Apps", String(scholarship ?? 0)],
    ["Merch Orders", String(orders ?? 0)],
  ];

  return (
    <Section
      label="Admin"
      title="Admin Overview"
      description="Manage members, meetings, documents, scholarship submissions, merch, and discussion board moderation."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([item, value]) => (
          <Card key={item}>
            <div className="text-sm text-zinc-500">{item}</div>
            <div className="mt-2 text-3xl font-black text-white">{value}</div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
