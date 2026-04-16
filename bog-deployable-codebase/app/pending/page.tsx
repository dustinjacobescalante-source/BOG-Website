export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-[#0b0d11] p-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
          Account Status
        </p>
        <h1 className="mt-4 text-3xl font-bold">Pending Approval</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Your account has been created, but it is still waiting for admin approval.
          You will be able to access the portal once your account is activated.
        </p>
      </div>
    </div>
  );
}
