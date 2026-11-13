import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ekskul = await ambilEkskul(Number(id));

  return {
    title: ekskul ? ekskul.nama : "Ekskul tidak ditemukan",
  };
}

export default async function DetailEkskul({ params }: Props) {
  const { id } = await params;
  const ekskul = await ambilEkskul(Number(id));

  // Poin 6: Id yang tidak ada menampilkan 404
  if (!ekskul) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Bagian Detail Ekskul (Tampil lebih dulu) */}
      <section className="mb-6 rounded-xl border bg-white p-6">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {ekskul.kategori}
        </span>
        <h1 className="mt-2 text-3xl font-bold">{ekskul.nama}</h1>
        <p className="mt-2 text-slate-600">
          {ekskul.hari}, Sesi {ekskul.sesi} ({JAM_SESI[ekskul.sesi]})
        </p>
        <p className="text-slate-600">Pembina: {ekskul.pembina}</p>
      </section>

      {/* Bagian Daftar Anggota dengan Suspense */}
      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Anggota terdaftar</h2>
        <Suspense
          fallback={<p className="text-slate-500">Memuat anggota...</p>}
        >
          <DaftarAnggota ekskulId={ekskul.id} kuota={ekskul.kuota} />
        </Suspense>
      </section>
    </main>
  );
}

// Memisahkan komponen Anggota agar bisa dibungkus Suspense secara independen
async function DaftarAnggota({
  ekskulId,
  kuota,
}: {
  ekskulId: number;
  kuota: number;
}) {
  const anggota = await ambilAnggota(ekskulId);

  // Mengambil nama dari cookie untuk pengecekan label "Kamu"
  const cookieStore = await cookies();
  const namaSiswa = cookieStore.get("nama")?.value;

  const terisi = anggota.length;

  return (
    <div>
      <p className="mb-4 font-medium text-slate-700">
        {terisi} dari {kuota} tempat terisi
      </p>

      {terisi === 0 ? (
        <p className="text-slate-500">Belum ada anggota.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {anggota.map((a) => (
            <li
              key={a.nomor}
              className="flex items-center justify-between rounded border px-4 py-2"
            >
              <div>
                <span className="font-medium text-slate-800">{a.nama}</span>
                <span className="text-slate-500"> · {a.kelas}</span>
              </div>

              {a.nama === namaSiswa && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  Kamu
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
