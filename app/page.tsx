import Link from "next/link";
import { ekskul } from "@/data/ekskul";

export default function Beranda() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4x1 font-bold">
          Temukan ekskul yang menarik di sini.
        </h1>
        <p className="mt-3 text-slate-600">
          Olahraga, Seni, Akademik, Teknologi
        </p>
        <Link
          href="/ekskul"
          className="inline-block mt-6 bg-blue-600 text-white 
                px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Lihat Semua Ekskul
        </Link>
      </section>
      <h2 className="text-3x1 font-bold text-center mb-8">
        Ekstrakurikuler Unggulan
      </h2>
    </div>
  );
}
//commit
