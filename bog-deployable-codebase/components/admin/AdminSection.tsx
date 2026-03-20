import { ReactNode } from "react";

type AdminSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function AdminSection({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: AdminSectionProps) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-[#0b0d11]/95 px-6 py-6 backdrop-blur-sm sm:px-8 sm:py-8 ${className}`}
    >
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[2rem]">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
