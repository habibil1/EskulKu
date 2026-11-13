import { Metadata } from "next";
import { ambilEkskul } from "@/data/ambil";

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

  if (!ekskul) {
    return <div className="p-6">Ekskul tidak ditemukan</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{ekskul.nama}</h1>
    </main>
  );
}
