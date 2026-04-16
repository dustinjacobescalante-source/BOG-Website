'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  FileText,
  Pin,
  Trash2,
  ExternalLink,
  Library,
} from 'lucide-react';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import DocumentUpload from '@/components/documents/DocumentUpload';

type Document = {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  file_url?: string | null;
  created_at?: string | null;
  uploaded_by?: string | null;
  is_pinned?: boolean | null;
  profiles?: {
    full_name?: string | null;
  } | null;
};

export default function DocumentsLibraryPage({
  documents,
  currentUserId,
  isAdmin,
  showHeader = true,
}: {
  documents: Document[];
  currentUserId: string | null;
  isAdmin: boolean;
  showHeader?: boolean;
}) {
  const [search, setSearch] = useState('');

  const filteredDocs = useMemo(() => {
    return [...documents]
      .filter((doc) => {
        return (
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          (doc.description || '').toLowerCase().includes(search.toLowerCase()) ||
          (doc.profiles?.full_name || '')
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      })
      .sort((a, b) => {
        const aPinned = a.is_pinned ? 1 : 0;
        const bPinned = b.is_pinned ? 1 : 0;

        if (aPinned !== bPinned) {
          return bPinned - aPinned;
        }

        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;

        return bDate - aDate;
      });
  }, [documents, search]);

  function getFileType(url?: string | null) {
    if (!url) return 'FILE';

    const lower = url.toLowerCase();

    if (lower.includes('.pdf')) return 'PDF';
    if (lower.includes('.doc') || lower.includes('.docx')) return 'DOC';
    if (lower.includes('.xls') || lower.includes('.xlsx')) return 'XLS';
    if (lower.includes('.ppt') || lower.includes('.pptx')) return 'PPT';
    if (
      lower.includes('.jpg') ||
      lower.includes('.jpeg') ||
      lower.includes('.png') ||
      lower.includes('.webp')
    ) {
      return 'IMG';
    }

    return 'FILE';
  }

  function formatUploadDate(date?: string | null) {
    if (!date) return 'Unknown date';

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function confirmDelete(
    event: React.FormEvent<HTMLFormElement>,
    title: string
  ) {
    const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) {
      event.preventDefault();
    }
  }

  const pinnedCount = documents.filter((doc) => doc.is_pinned).length;

  const content = (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_22%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <Library className="h-3 w-3" />
                Document Command
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                Keep resources organized.
                <br />
                Find what matters.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Move fast inside the library.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Store meeting agendas, accountability sheets, scholarship files,
                brochures, and key member resources in one clean place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Total Documents
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {documents.length}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Files currently available in the portal.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Pinned Files
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {pinnedCount}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Priority documents kept at the top.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Search Results
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {filteredDocs.length}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Files matching your current search.
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-black/25 px-5 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Search Library
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  placeholder="Search documents, descriptions, or uploader..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40"
                />
              </div>

              <div className="mt-4 text-xs leading-5 text-zinc-500">
                Search by title, description, or member name.
              </div>
            </div>

            <div className="rounded-[28px] border border-red-500/20 bg-gradient-to-br from-red-600/14 to-red-950/10 px-5 py-5 shadow-[0_12px_40px_rgba(239,68,68,0.10)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Library Standard
              </div>

              <div className="mt-3 text-xl font-bold text-white">
                Keep files clean, useful, and easy to find.
              </div>

              <div className="mt-3 text-sm leading-6 text-zinc-300">
                Pin the most important resources, keep titles clear, and remove
                outdated material when it no longer serves the brotherhood.
              </div>
            </div>
          </div>
        </div>
      </section>

      <DocumentUpload />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDocs.length ? (
          filteredDocs.map((doc) => {
            const canDelete = isAdmin || doc.uploaded_by === currentUserId;

            return (
              <div
                key={doc.id}
                className={`group relative cursor-pointer rounded-[30px] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)] ${
                  doc.is_pinned
                    ? 'border-yellow-500/35 bg-gradient-to-br from-yellow-500/[0.08] to-black/40 hover:border-yellow-400/45'
                    : 'border-white/10 bg-white/[0.03] hover:border-red-500/30 hover:bg-white/[0.045]'
                }`}
                onClick={() => {
                  if (doc.file_url) {
                    window.open(doc.file_url, '_blank');
                  }
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          {getFileType(doc.file_url)}
                        </span>

                        {doc.is_pinned ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-yellow-300">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </span>
                        ) : null}
                      </div>

                      <div
                        className={`mt-3 text-xl font-bold leading-tight transition ${
                          doc.is_pinned
                            ? 'text-yellow-100 group-hover:text-yellow-300'
                            : 'text-white group-hover:text-red-400'
                        }`}
                      >
                        {doc.title}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-2 text-zinc-400">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-zinc-400">
                    {doc.description || 'Member resource'}
                  </p>

                  <div className="mt-4 space-y-1 text-xs text-zinc-500">
                    <div>
                      Uploaded by:{' '}
                      <span className="text-zinc-300">
                        {doc.profiles?.full_name || 'Member'}
                      </span>
                    </div>

                    <div>
                      Uploaded on:{' '}
                      <span className="text-zinc-300">
                        {formatUploadDate(doc.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {doc.file_url ? (
                      <span
                        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold ${
                          doc.is_pinned
                            ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                        }`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open File
                      </span>
                    ) : null}

                    {isAdmin ? (
                      <form
                        action={`/api/documents/${doc.id}/pin`}
                        method="POST"
                        onSubmit={(event) => event.stopPropagation()}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-2xl border border-yellow-500/40 px-3 py-2 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pin className="h-3.5 w-3.5" />
                          {doc.is_pinned ? 'Unpin' : 'Pin'}
                        </button>
                      </form>
                    ) : null}

                    {canDelete ? (
                      <form
                        action={`/api/documents/${doc.id}`}
                        method="POST"
                        onSubmit={(event) => {
                          event.stopPropagation();
                          confirmDelete(event, doc.title);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Card>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
              <div className="text-lg font-semibold text-white">
                No documents found
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Try a different search or upload a new file to the library.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  if (!showHeader) {
    return content;
  }

  return (
    <Section
      label="Portal"
      title="Document Library"
      description="Access templates, agendas, packets, and member resources."
    >
      {content}
    </Section>
  );
}
