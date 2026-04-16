import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { AuthForm } from '@/components/auth/auth-forms';

export default function ResetPasswordPage() {
  return (
    <Section label="Auth" title="Reset Password" description="Send a reset link to your email.">
      <div className="mx-auto max-w-xl">
        <Card>
          <AuthForm mode="reset-password" />
          <div className="mt-4 text-sm text-zinc-400">
            Back to <Link href="/auth/sign-in" className="hover:text-white">sign in</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
