"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  Mail,
  UserRound,
  FileText,
  ArrowRight,
  Trophy,
} from "lucide-react";

type ScholarshipBoardItem = {
  id: string;
  student_name: string | null;
  email: string | null;
  status: string | null;
  created_at: string | null;
  review_notes: string | null;
  display_score: number;
};

type ScholarshipBoardClientProps = {
  applications: ScholarshipBoardItem[];
};

type FilterKey = "all" | "pending" | "approved" | "denied" | "archived";

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusTone(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (value === "denied" || value === "rejected") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  if (value === "archived") {
    return "border-slate-400/20 bg-slate-500/10 text-slate-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function getStatusLabel(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") return "Approved";
  if (value === "denied" || value === "rejected") return "Denied";
  if (value === "archived") return "Archived";
  return "Pending";
}

function normalizeFilterStatus(status?: string | null): FilterKey {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") return "approved";
  if (value === "denied" || value === "rejected") return "denied";
  if (value === "archived") return "archived";
  return "pending";
}

export default function ScholarshipBoardClient({
  applications,
}: ScholarshipBoardClientProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visibleApplications = useMemo(() => {
    let items = [...applications];

    if (!showArchived) {
      items = items.filter(
        (app) => (app.status ?? "").toLowerCase() !== "archived"
      );
    }

    if (activeFilter !== "all") {
      items = items.filter(
        (app) => normalizeFilterStatus(app.status) === activeFilter
      );
    }

    return items;
  }, [applications, showArchived, activeFilter]);

  const counts = useMemo(() => {
    const base = showArchived
      ? applications
      : applications.filter(
          (app) => (app.status ?? "").toLowerCase() !== "archived"
        );

    return {
      all: base.length,
      pending: base.filter((app) => normalizeFilterStatus(app.status) === "pending")
        .length,
      approved: base.filter(
        (app) => normalizeFilterStatus(app.status) === "approved"
      ).length,
      denied: base.filter((app) => normalizeFilterStatus(app.status) === "denied")
        .length,
      archived: base.filter(
        (app) => normalizeFilterStatus(app.status) === "archived"
      ).length,
    };
  }, [applications, showArchived]);

  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "denied", label: "Denied", count: counts.denied },
    { key: "archived", label: "Archived", count: counts.archived },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.92),rgba(10,12,18,0.97))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Board Controls
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Filter the scholarship board by status and choose whether archived
              applications stay visible.
            </p>
          </div>

          <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowArchived(checked);
                if (!checked && activeFilter === "archived") {
                  setActiveFilter("all");
                }
              }}
              className="h-4 w-4 rounded border-white/20 bg-black/30 accent-white"
            />
            <span className="font-medium">Show Archived</span>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const disabled = filter.key === "archived" && !showArchived;
            const active = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => !disabled && setActiveFilter(filter.key)}
                disabled={disabled}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  disabled
                    ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600"
                    : active
                    ? "border-white/15 bg-white/[0.1] text-white"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <span>{filter.label}</span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-[11px]">
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {!visibleApplications.length ? (
        <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
          No scholarship applications found for the current filter.
        </div>
      ) : null}

      <div className="space-y-4">
        {visibleApplications.map((app) => {
          const hasReviewNotes =
            !!app.review_notes && app.review_notes.trim().length > 0;
          const reviewHref = `/admin/scholarship/${app.id}`;
          const isArchived = normalizeFilterStatus(app.status) === "archived";

          return (
            <div
              key={app.id}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 xl:max-w-[520px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                        app.status
                      )}`}
                    >
                      {getStatusLabel(app.status)}
                    </span>

                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Application Record
                    </span>

                    {hasReviewNotes ? (
                      <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                        Notes Added
                      </span>
                    ) : null}

                    {isArchived ? (
                      <span className="inline-flex items-center rounded-full border border-slate-400/20 bg-slate-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Hidden from active board
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-white">
                    {app.student_name || "Unnamed Applicant"}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">
                      {app.email || "No email provided"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 className="h-4 w-4" />
                    <span>Submitted {formatDate(app.created_at)}</span>
                  </div>

                  <div className="mt-3 break-all text-xs text-slate-500">
                    Review Path: {reviewHref}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 xl:min-w-[620px]">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <UserRound className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Applicant
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {app.student_name || "Unnamed"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <BadgeCheck className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Status
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {getStatusLabel(app.status)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Trophy className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Score
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {app.display_score} / 100
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Review
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {hasReviewNotes ? "Notes Saved" : "No Notes Yet"}
                    </div>
                  </div>

                  <div className="flex items-stretch">
                    <Link
                      href={reviewHref}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                    >
                      Open Review
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
