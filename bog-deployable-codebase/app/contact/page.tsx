import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { JoinForm } from '@/components/forms/join-form';

export default function Page() {
  return (
    <Section label="Contact" title="Contact BOG" description="Public contact and join flow.">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {[['Club Email','BOGBuffalodogs@gmail.com'],['Leadership Contact','BOGDustinE@gmail.com'],['Website Domain','BOG.com']].map(([label,value]) => (
            <Card key={label}>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-500">{label}</div>
              <div className="mt-3 break-words text-lg font-bold text-white">{value}</div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="text-lg font-bold text-white">Apply / Join</div>
          <p className="mt-2 text-sm text-zinc-400">Send an interest request to start the approval process.</p>
          <div className="mt-4">
            <JoinForm />
          </div>
        </Card>
      </div>
    </Section>
  );
}
