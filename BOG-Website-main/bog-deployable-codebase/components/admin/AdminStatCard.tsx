import { ReactNode } from "react";
import AdminCard from "@/components/admin/AdminCard";

type AdminStatCardProps = {
  label: string;
  value: string;
  subtext: string;
  icon: ReactNode;
};

export default function AdminStatCard({
  label,
  value,
  subtext,
  icon,
}: AdminStatCardProps) {
  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
            {label}
          </p>

          <h2 className="mt-3 text-[2rem] font-semibold leading-none tracking-tight text-white">
            {value}
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {subtext}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition group-hover:border-white/20 group-hover:bg-white/10">
          {icon}
        </div>
      </div>
    </AdminCard>
  );
}
