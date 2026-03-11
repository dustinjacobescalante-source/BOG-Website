import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { ScholarshipForm } from '@/components/forms/scholarship-form';

export default function Page() {
  return (
    <Section label="Scholarship" title="Iron Sharpens Iron Scholarship" description="A public scholarship page with a submission workflow backed by Supabase.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Minimum 3.0 GPA','College or trade school eligible','Application required','500–750 word essay','Recommendation letter','Official transcript'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-200">{item}</div>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-400">Submission email: BOGBuffalodogs@gmail.com</p>
        </Card>
        <Card>
          <ScholarshipForm />
        </Card>
      </div>
    </Section>
  );
}
