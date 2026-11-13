"use client";

export default function ErrorEkskul({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <h2 className="mb-4 text-xl font-bold text-red-600">Terjadi Galat!</h2>
      <p className="mb-6 text-slate-600">Gagal memuat daftar ekskul.</p>
      <button
        onClick={() => reset()}
        className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
      >
        Coba lagi
      </button>
    </div>
  );
}
