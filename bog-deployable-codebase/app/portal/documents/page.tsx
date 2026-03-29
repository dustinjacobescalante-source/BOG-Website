'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';

type Document = {
  id: string;
  title: string;
  category: string;
  description?: string;
  file_url?: string;
  created_at?: string;
};

export default function Page({ documents = [] }: { documents: Document[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(documents.map((d) => d.category || 'Uncategorized'))
    );
    return ['All', ...unique];
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        (doc.description || '')
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' || doc.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, activeCategory]);

  function getFileType(url?: string) {
    if (!url) return 'FILE';
    if (url.includes('.pdf')) return 'PDF';
    if (url.includes('.doc')) return 'DOC';
    if (url.includes('.xls')) return 'XLS';
    return 'FILE';
  }

  return (
    <Section
      label="Portal"
      title="Document Library"
      description="Access templates, agendas, packets, and member resources."
    >
      <div className="space-y-6">
        {/* SEARCH + FILTER */}
        <Card>
          <div className="space-y-4">
            <input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeCategory === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-black/30 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* DOCUMENT GRID */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocs.length ? (
            filteredDocs.map((doc) => (
              <Card key={doc.id}>
                <div className="flex items-start justify-between">
                  <div className="text-base font-semibold text-white">
                    {doc.title}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] text-zinc-400">
                    {getFileType(doc.file_url)}
                  </div>
                </div>

                <div className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                  {doc.category || 'Uncategorized'}
                </div>

                <p className="mt-3 text-sm text-zinc-400">
                  {doc.description || 'Member resource'}
                </p>

                {doc.file_url && (
                  <Link
                    href={doc.file_url}
                    target="_blank"
                    className="mt-4 inline-block text-sm font-semibold text-red-400 hover:text-red-300"
                  >
                    Open file →
                  </Link>
                )}
              </Card>
            ))
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