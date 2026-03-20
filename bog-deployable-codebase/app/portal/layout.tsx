import PortalShell from "@/components/portal/PortalShell";
import { requireUser, getProfile } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();
  const profile = await getProfile();

  return (
    <PortalShell
      fullName={profile?.full_name ?? null}
      rank={profile?.rank ?? null}
      role={profile?.role ?? null}
    >
      {children}
    </PortalShell>
  );
}
