import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { AuthForm } from '@/components/auth/auth-forms';

export default function SignInPage() {
  return (
    <Section label="Auth" title="Member Sign In" description="Secure access for Buffalo Dogs members.">
      <div className="mx-auto max-w-xl">
        <Card>
          <AuthForm mode="sign-in" />
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
            <Link href="/auth/reset-password" className="hover:text-white">Forgot password?</Link>
            <Link href="/auth/sign-up" className="hover:text-white">Create account</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
