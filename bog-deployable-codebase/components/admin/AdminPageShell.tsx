import { ReactNode } from "react";

type AdminPageShellProps = {
  children: ReactNode;
};

export default function AdminPageShell({ children }: AdminPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_60%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="space-y-6 lg:space-y-8">{children}</div>
      </div>
    </main>
  );
}
