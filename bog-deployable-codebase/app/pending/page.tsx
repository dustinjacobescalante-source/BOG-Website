export default function PendingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Account Pending Approval</h1>
        <p className="text-zinc-300">
          Your account has been created, but access to the member portal is still pending leadership approval.
        </p>
        <p className="text-zinc-400 text-sm">
          Once approved, you will be able to access all portal features.
        </p>
      </div>
    </main>
  );
}
