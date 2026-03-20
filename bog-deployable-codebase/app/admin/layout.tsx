import { requireAdmin, getProfile } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const profile = await getProfile();

  return (
    <AdminShell
      fullName={profile?.full_name ?? "Admin"}
      rank={profile?.rank ?? "omega"}
      role={profile?.role ?? "admin"}
    >
      {children}
    </AdminShell>
  );
}
