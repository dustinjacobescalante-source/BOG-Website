import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { AuthForm } from '@/components/auth/auth-forms';

export default function SignUpPage() {
  return (
    <Section label="Auth" title="Create Member Account" description="Use this if leadership has approved your access.">
      <div className="mx-auto max-w-xl">
        <Card>
          <AuthForm mode="sign-up" />
          <div className="mt-4 text-sm text-zinc-400">
            Already have access? <Link href="/auth/sign-in" className="hover:text-white">Sign in</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
