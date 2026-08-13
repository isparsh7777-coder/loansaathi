export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-ink-100 border-t-marigold" />
      </div>
      <p className="text-sm font-medium text-ink-500">Loading LoanSaathi…</p>
    </div>
  );
}
