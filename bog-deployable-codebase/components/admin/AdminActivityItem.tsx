type AdminActivityItemProps = {
  title: string;
  detail: string;
  time: string;
};

export default function AdminActivityItem({
  title,
  detail,
  time,
}: AdminActivityItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-[#11151b]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-zinc-400">{detail}</p>
        </div>

        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {time}
        </span>
      </div>
    </div>
  );
}
