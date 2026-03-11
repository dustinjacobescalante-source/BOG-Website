import { ReactNode } from 'react';
export function Section({ label, title, description, children }: { label: string; title: string; description?: string; children?: ReactNode }) {
  return <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><div className="section-label">{label}</div><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>{description ? <p className="mt-4 text-zinc-400">{description}</p> : null}</div>{children ? <div className="mt-8">{children}</div> : null}</div></section>;
}
