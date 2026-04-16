import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import DocumentsLibraryPage from "@/components/documents/DocumentsLibraryPage";

export default async function AdminDocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select(
      `
      *,
      profiles:uploaded_by (
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Control the library. Keep resources clean."
        description="Upload documents, pin the most important files, remove outdated material, and keep the brotherhood library organized."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/portal/documents", label: "View Member Library" },
        ]}
      />

      <DocumentsLibraryPage
        documents={documents || []}
        currentUserId={user.id}
        isAdmin={true}
        showHeader={false}
      />
    </AdminPageShell>
  );
}
