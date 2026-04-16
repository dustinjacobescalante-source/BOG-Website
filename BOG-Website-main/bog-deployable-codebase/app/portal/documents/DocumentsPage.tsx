'use client';

import { useMemo, useState } from 'react';
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

export default function DocumentsPage({
  documents,
  currentUserId,
  isAdmin,
}: {
  documents: Document[];
  currentUserId: string | null;
  isAdmin: boolean;
}) {
  const [search, setSearch] = useState('');

  const filteredDocs = useMemo(() => {
    return [...documents]
      .filter((doc) => {
        return (
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          (doc.description || '').toLowerCase().includes(search.toLowerCase()) ||
          (doc.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase())
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

  function confirmDelete(event: React.FormEvent<HTMLFormElement>, title: string) {
    const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) {
      event.preventDefault();
    }
  }

  return (
    <Section
      label="Portal"
      title="Document Library"
      description="Access templates, agendas, packets, and member resources."
    >
      <div className="space-y-6">
        <DocumentUpload />

        <Card>
          <div className="space-y-4">
            <input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
            />
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocs.length ? (
            filteredDocs.map((doc) => {
              const canDelete = isAdmin || doc.uploaded_by === currentUserId;

              return (
                <div
                  key={doc.id}
                  className="group relative rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:border-red-500/30 hover:bg-black/40 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                  onClick={() => {
                    if (doc.file_url) {
                      window.open(doc.file_url, '_blank');
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold text-white group-hover:text-red-400 transition">
                        {doc.title}
                      </div>

                      {doc.is_pinned ? (
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
                          Pinned
                        </span>
                      ) : null}
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-zinc-400">
                      {getFileType(doc.file_url)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-zinc-400">
                    {doc.description || 'Member resource'}
                  </p>

                  <div className="mt-2 text-xs text-zinc-500">
                    Uploaded by:{' '}
                    <span className="text-zinc-300">
                      {doc.profiles?.full_name || 'Member'}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    Uploaded on:{' '}
                    <span className="text-zinc-300">
                      {formatUploadDate(doc.created_at)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {doc.file_url ? (
                      <span className="text-sm font-semibold text-red-400">
                        Open file →
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
                          className="rounded-lg border border-yellow-500/40 px-3 py-1 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                          className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Delete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <Card>
              <div className="text-center text-sm text-zinc-400">
                No documents found.
              </div>
            </Card>
          )}
        </div>
      </div>
    </Section>
  );
}