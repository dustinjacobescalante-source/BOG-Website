import { ReactNode } from "react";

type AdminCardProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminCard({
  children,
  className = "",
}: AdminCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e1014]/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#11151b] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">{children}</div>
    </div>
  );
}
