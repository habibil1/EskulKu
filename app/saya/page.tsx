import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ekskul, pendaftar, JAM_SESI } from "@/data/ekskul";
import { batalkanAction } from "./action";

export const instant = false;

export const metadata: Metadata = {
  title: "Ekskul Saya",
};

export default async function EkskulSaya() {
  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-3xl font-bold">Ekskul Saya</h1>
        <p className="text-slate-600">
          Kamu belum mendaftar apa pun.{" "}
          <Link href="/ekskul" className="font-medium text-blue-600 underline">
            Lihat daftar ekskul
          </Link>
        </p>
      </main>
    );
  }

  const pendaftaranSaya = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase(),
  );

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Ekskul Saya</h1>

      {/* Ringkasan identitas dan jumlah ekskul diikuti */}
      <p className="mb-6 font-medium text-slate-700">
        {nama} · {kelas} · {pendaftaranSaya.length} ekskul diikuti
      </p>

      {pendaftaranSaya.length === 0 ? (
        <p className="text-slate-500">Belum ada ekskul yang diikuti.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {pendaftaranSaya.map((item) => {
            const detail = ekskul.find((e) => e.id === item.ekskulId);
            if (!detail) return null;

            return (
              <li
                key={item.nomor}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5"
              >
                <div>
                  <Link
                    href={`/ekskul/${detail.id}`}
                    className="text-lg font-bold text-blue-600 hover:underline"
                  >
                    {detail.nama}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    {detail.hari}, Sesi {detail.sesi} ({JAM_SESI[detail.sesi]})
                  </p>
                </div>

                <form action={batalkanAction}>
                  <input type="hidden" name="nomor" value={item.nomor} />
                  <button
                    type="submit"
                    className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Batalkan
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
