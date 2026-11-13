import { Metadata } from "next";
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "@/data/ekskul";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

export default async function DaftarEkskul({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Membaca saringan dari URL
  const sp = await searchParams;
  const kategoriQ = typeof sp.kategori === "string" ? sp.kategori : "";
  const hariQ = typeof sp.hari === "string" ? sp.hari : "";

  // 2. Mengambil semua data ekskul
  let daftar = await ambilSemuaEkskul();

  // 3. Logika Saringan (Filter) Server
  if (kategoriQ && DAFTAR_KATEGORI.includes(kategoriQ as any)) {
    daftar = daftar.filter((e) => e.kategori === kategoriQ);
  }

  if (hariQ && DAFTAR_HARI.includes(hariQ)) {
    daftar = daftar.filter((e) => e.hari === hariQ);
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Daftar Ekskul</h1>

      {/* Formulir murni HTML tanpa onChange */}
      <form method="GET" className="mb-6 flex flex-wrap gap-4">
        <select
          name="kategori"
          defaultValue={kategoriQ}
          className="rounded border p-2 text-slate-700"
        >
          <option value="">Semua kategori</option>
          {DAFTAR_KATEGORI.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          name="hari"
          defaultValue={hariQ}
          className="rounded border p-2 text-slate-700"
        >
          <option value="">Semua hari</option>
          {DAFTAR_HARI.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Tombol Filter yang kini dimunculkan secara standar */}
        <button
          type="submit"
          className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          Saring
        </button>
      </form>

      <p className="mb-4 text-slate-600">{daftar.length} ekskul ditemukan</p>

      {daftar.length === 0 ? (
        <p className="text-slate-500">Tidak ada ekskul yang cocok.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {daftar.map((e) => {
            const terisi = pendaftar.filter((p) => p.ekskulId === e.id).length;
            const sisa = e.kuota - terisi;

            return (
              <Link
                href={`/ekskul/${e.id}`}
                key={e.id}
                className="flex flex-col justify-between rounded-xl border bg-white p-5 transition hover:shadow-md"
              >
                <div>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {e.kategori}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-slate-800">
                    {e.nama}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {e.hari}, Sesi {e.sesi} ({JAM_SESI[e.sesi]})
                  </p>
                </div>
                <div className="mt-5 border-t pt-3 font-semibold">
                  {sisa <= 0 ? (
                    <span className="text-red-600">Penuh</span>
                  ) : (
                    <span className="text-emerald-600">
                      Sisa {sisa} dari {e.kuota} tempat
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
