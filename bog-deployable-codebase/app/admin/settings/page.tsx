import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  BookOpen,
  Radio,
  Save,
  Eye,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{
  saved?: string;
  error?: string;
}>;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, rank")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: settingsRow, error: settingsLoadError } = await supabase
    .from("portal_settings")
    .select("*")
    .eq("key", "monthly_focus")
    .maybeSingle();

  async function saveMonthlyFocus(formData: FormData) {
    "use server";

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

    const payload = {
      key: "monthly_focus",
      book_title: String(formData.get("book_title") ?? "").trim(),
      book_author: String(formData.get("book_author") ?? "").trim(),
      book_cover_url: String(formData.get("book_cover_url") ?? "").trim(),
      book_description: String(formData.get("book_description") ?? "").trim(),
      book_why_it_matters: String(
        formData.get("book_why_it_matters") ?? ""
      ).trim(),
      book_monthly_emphasis: String(
        formData.get("book_monthly_emphasis") ?? ""
      ).trim(),
      sermon_title: String(formData.get("sermon_title") ?? "").trim(),
      sermon_speaker: String(formData.get("sermon_speaker") ?? "").trim(),
      sermon_description: String(
        formData.get("sermon_description") ?? ""
      ).trim(),
      sermon_key_takeaway: String(
        formData.get("sermon_key_takeaway") ?? ""
      ).trim(),
      sermon_member_reminder: String(
        formData.get("sermon_member_reminder") ?? ""
      ).trim(),
    };

    const { error } = await supabase.from("portal_settings").upsert(payload, {
      onConflict: "key",
    });

    if (error) {
      const encoded = encodeURIComponent(error.message);
      redirect(`/admin/settings?error=${encoded}`);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/portal");
    redirect("/admin/settings?saved=1");
  }

  const bookTitle = settingsRow?.book_title?.trim() || "No book title set";
  const bookAuthor = settingsRow?.book_author?.trim() || "No author set";
  const bookDescription =
    settingsRow?.book_description?.trim() ||
    "No book description has been added yet.";
  const bookWhyItMatters =
    settingsRow?.book_why_it_matters?.trim() ||
    "No reason has been added yet.";
  const bookMonthlyEmphasis =
    settingsRow?.book_monthly_emphasis?.trim() ||
    "No monthly emphasis has been added yet.";

  const sermonTitle =
    settingsRow?.sermon_title?.trim() || "No sermon title set";
  const sermonSpeaker =
    settingsRow?.sermon_speaker?.trim() || "No speaker set";
  const sermonDescription =
    settingsRow?.sermon_description?.trim() ||
    "No sermon description has been added yet.";
  const sermonKeyTakeaway =
    settingsRow?.sermon_key_takeaway?.trim() ||
    "No key takeaway has been added yet.";
  const sermonMemberReminder =
    settingsRow?.sermon_member_reminder?.trim() ||
    "No member reminder has been added yet.";

  return (
    <div className="space-y-6 py-4 sm:py-6">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
              <Layers3 className="h-3.5 w-3.5" />
              Brotherhood Settings
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Control the monthly message.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Update the Book of the Month and Sermon of the Month from one
              admin control point. What you save here feeds the member-facing
              monthly focus.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(226,232,240,0.95))] px-5 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-105"
            >
              <Eye className="h-4 w-4" />
              View Member Portal
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Settings Scope
            </div>
            <div className="mt-2 text-2xl font-black text-white">Monthly</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This page controls the current monthly member-facing content.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Record Key
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {settingsRow?.key ?? "Monthly Focus"}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ensure the content is premium and meets BOG standard
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Status
            </div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Live Control
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Changes save directly into the admin-controlled content flow.
            </p>
          </div>
        </div>
      </section>

      {params.saved === "1" && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Monthly focus saved successfully.
        </div>
      )}

      {(params.error || settingsLoadError?.message) && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Save failed: {params.error ?? settingsLoadError?.message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form action={saveMonthlyFocus} className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,32,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-200">
              <BookOpen className="h-3.5 w-3.5" />
              Book of the Month
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Set the reading focus.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Update the featured book, supporting explanation, and monthly
              emphasis members should see inside the portal.
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Book Title
                </label>
                <input
                  name="book_title"
                  defaultValue={settingsRow?.book_title ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                  placeholder="The Daily Stoic"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Book Author
                </label>
                <input
                  name="book_author"
                  defaultValue={settingsRow?.book_author ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                  placeholder="Ryan Holiday & Stephen Hanselman"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Book Cover Image URL
                </label>
                <input
                  name="book_cover_url"
                  defaultValue={settingsRow?.book_cover_url ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                  placeholder="https://your-image-url.com/book-cover.jpg"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Book Description
                </label>
                <textarea
                  name="book_description"
                  defaultValue={settingsRow?.book_description ?? ""}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                  placeholder="Short description for the member portal."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Why It Matters
                  </label>
                  <textarea
                    name="book_why_it_matters"
                    defaultValue={settingsRow?.book_why_it_matters ?? ""}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="Why this book matters this month."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Monthly Emphasis
                  </label>
                  <textarea
                    name="book_monthly_emphasis"
                    defaultValue={settingsRow?.book_monthly_emphasis ?? ""}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-400/40"
                    placeholder="What the monthly focus should emphasize."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,32,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
              <Radio className="h-3.5 w-3.5" />
              Sermon of the Month
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Set the message focus.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Control the sermon message members see and the reminder that ties
              it back to the brotherhood standard.
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Sermon Title
                </label>
                <input
                  name="sermon_title"
                  defaultValue={settingsRow?.sermon_title ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-400/40"
                  placeholder="Kingdom Men Rising"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Speaker
                </label>
                <input
                  name="sermon_speaker"
                  defaultValue={settingsRow?.sermon_speaker ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-400/40"
                  placeholder="Monthly Leadership Focus"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">
                  Sermon Description
                </label>
                <textarea
                  name="sermon_description"
                  defaultValue={settingsRow?.sermon_description ?? ""}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-400/40"
                  placeholder="Short description for the member portal."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Key Takeaway
                  </label>
                  <textarea
                    name="sermon_key_takeaway"
                    defaultValue={settingsRow?.sermon_key_takeaway ?? ""}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-400/40"
                    placeholder="Main takeaway for members."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    Member Reminder
                  </label>
                  <textarea
                    name="sermon_member_reminder"
                    defaultValue={settingsRow?.sermon_member_reminder ?? ""}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-400/40"
                    placeholder="Reminder tied to the monthly message."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Save className="h-4 w-4" />
              Save Monthly Focus
            </button>

            <div className="text-sm text-slate-400">
              Saving here updates the member portal after refresh.
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,32,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Member-facing monthly focus
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              This is the live content currently saved for the portal.
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-[24px] border border-blue-400/15 bg-blue-500/5 p-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200">
                  <BookOpen className="h-3.5 w-3.5" />
                  Book Preview
                </div>

                <h3 className="mt-4 text-xl font-black text-white">
                  {bookTitle}
                </h3>

                <p className="mt-2 text-sm font-semibold text-slate-300">
                  {bookAuthor}
                </p>

                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  <p>{bookDescription}</p>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Why It Matters
                    </div>
                    <p className="mt-2">{bookWhyItMatters}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Monthly Emphasis
                    </div>
                    <p className="mt-2">{bookMonthlyEmphasis}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-red-400/15 bg-red-500/5 p-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
                  <Radio className="h-3.5 w-3.5" />
                  Sermon Preview
                </div>

                <h3 className="mt-4 text-xl font-black text-white">
                  {sermonTitle}
                </h3>

                <p className="mt-2 text-sm font-semibold text-slate-300">
                  {sermonSpeaker}
                </p>

                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  <p>{sermonDescription}</p>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Key Takeaway
                    </div>
                    <p className="mt-2">{sermonKeyTakeaway}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Member Reminder
                    </div>
                    <p className="mt-2">{sermonMemberReminder}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
