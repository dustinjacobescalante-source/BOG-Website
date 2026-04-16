import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";

type AdminActionCardProps = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

export default function AdminActionCard({
  title,
  description,
  href,
  icon,
}: AdminActionCardProps) {
  return (
    <Link href={href}>
      <AdminCard>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition group-hover:border-white/20 group-hover:bg-white/10">
          {icon}
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-zinc-300 transition group-hover:text-white">
          <span>Open</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </AdminCard>
    </Link>
  );
}
