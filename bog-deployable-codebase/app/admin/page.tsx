import { Users, Shield, Wallet, Activity } from "lucide-react";

const stats = [
  {
    label: "Total Members",
    value: "248",
    subtext: "Active accounts with current portal access.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Pending Reviews",
    value: "17",
    subtext: "Items waiting for admin action.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: "Monthly Revenue",
    value: "$18.2K",
    subtext: "Gross processed this month.",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    label: "System Health",
    value: "99.9%",
    subtext: "Core systems operational.",
    icon: <Activity className="h-5 w-5" />,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <section className="rounded-[2rem] border border-white/10 bg-[#0b0d11] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Admin Command
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Admin Overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              A cleaner, sharper control center for managing your platform.
            </p>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-[#0e1014] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {stat.subtext}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
