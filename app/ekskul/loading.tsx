export default function LoadingEkskul() {
  return (
    <div className="p-6">
      <div className="h-8 w-1/4 animate-pulse rounded bg-slate-200 mb-6"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Kerangka kartu */}
        <div className="h-32 w-full animate-pulse rounded-xl border bg-slate-100"></div>
        <div className="h-32 w-full animate-pulse rounded-xl border bg-slate-100"></div>
        <div className="h-32 w-full animate-pulse rounded-xl border bg-slate-100"></div>
      </div>
    </div>
  );
}
