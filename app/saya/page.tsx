import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekskul Saya",
};

export default function EkskulSaya() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Ekskul Saya</h1>
      {/* Nanti kita isi dengan daftar ekskul yang diikuti murid */}
    </main>
  );
}
