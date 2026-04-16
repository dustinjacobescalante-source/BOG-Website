import AdminLayout from "@/components/admin/AdminLayout";
import { requireUser, getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const profile = await getProfile();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  return (
    <AdminLayout
      fullName={profile?.full_name ?? null}
      rank={profile?.rank ?? null}
      role={profile?.role ?? null}
    >
      {children}
    </AdminLayout>
  );
}