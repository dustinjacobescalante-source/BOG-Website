'use client';

import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

function slugifyFileName(name: string) {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '').toLowerCase();
}

export function ScholarshipForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [essayFile, setEssayFile] = useState<File | null>(null);
  const [recommendationFile, setRecommendationFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  const essayInputRef = useRef<HTMLInputElement | null>(null);
  const recommendationInputRef = useRef<HTMLInputElement | null>(null);
  const transcriptInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFile(file: File, folder: string) {
    const timestamp = Date.now();
    const filePath = `${folder}/${timestamp}-${slugifyFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from('scholarship-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('scholarship-files')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      if (!essayFile) {
        throw new Error('Please upload the essay file.');
      }

      if (!recommendationFile) {
        throw new Error('Please upload the recommendation letter.');
      }

      if (!transcriptFile) {
        throw new Error('Please upload the transcript.');
      }

      const essayFileUrl = await uploadFile(essayFile, 'essays');
      const recommendationFileUrl = await uploadFile(
        recommendationFile,
        'recommendations'
      );
      const transcriptFileUrl = await uploadFile(transcriptFile, 'transcripts');

      const payload = {
        student_name: String(formData.get('student_name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        school_name: String(formData.get('school_name') ?? '').trim(),
        gpa: Number(formData.get('gpa') ?? 0),
        intended_path: String(formData.get('intended_path') ?? '').trim(),
        activities: String(formData.get('activities') ?? '').trim(),
        essay_prompt: String(formData.get('essay_prompt') ?? '').trim(),
        essay_file_url: essayFileUrl,
        recommendation_file_url: recommendationFileUrl,
        transcript_file_url: transcriptFileUrl,
      };

      const res = await fetch('/api/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to submit application.');
      }

      form.reset();
      setEssayFile(null);
      setRecommendationFile(null);
      setTranscriptFile(null);

      if (essayInputRef.current) essayInputRef.current.value = '';
      if (recommendationInputRef.current) recommendationInputRef.current.value = '';
      if (transcriptInputRef.current) transcriptInputRef.current.value = '';

      setMessage('Application submitted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit application.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Applicant Information
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="student_name"
            required
            placeholder="Student name"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />

          <input
            name="school_name"
            placeholder="School name"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />

          <input
            name="gpa"
            type="number"
            step="0.01"
            min="0"
            max="5"
            placeholder="GPA"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />

          <input
            name="intended_path"
            placeholder="College or trade school path"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Essay & Activities
        </div>

        <div className="space-y-4">
          <select
            name="essay_prompt"
            required
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-red-500/40"
            defaultValue=""
          >
            <option value="" disabled>
              Select essay prompt
            </option>
            <option value="A">Prompt A</option>
            <option value="B">Prompt B</option>
            <option value="C">Prompt C</option>
          </select>

          <textarea
            name="activities"
            rows={5}
            placeholder="Activities, leadership, volunteer service, and work experience"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Required Uploads
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block text-sm font-semibold text-white">
              Essay File
            </label>
            <input
              ref={essayInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setEssayFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
            />
            {essayFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <FileText className="h-4 w-4" />
                {essayFile.name}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block text-sm font-semibold text-white">
              Recommendation Letter
            </label>
            <input
              ref={recommendationInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setRecommendationFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
            />
            {recommendationFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <FileText className="h-4 w-4" />
                {recommendationFile.name}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="mb-2 block text-sm font-semibold text-white">
              Transcript
            </label>
            <input
              ref={transcriptInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setTranscriptFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
            />
            {transcriptFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <FileText className="h-4 w-4" />
                {transcriptFile.name}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
