"use server";

import { pendaftar } from "@/data/ekskul";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function batalkanAction(formData: FormData) {
  const nomor = Number(formData.get("nomor"));

  // Baca identitas murid dari cookie saat ini
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value?.toLowerCase();
  const kelasCookie = cookieStore.get("kelas")?.value?.toLowerCase();

  // Jika tidak ada cookie identitas, tolak permintaan
  if (!namaCookie || !kelasCookie) return;

  // Cari indeks data pendaftaran berdasarkan nomor
  const index = pendaftar.findIndex((p) => p.nomor === nomor);
  if (index === -1) return;

  const target = pendaftar[index];

  // Poin 13: Periksa ulang bahwa pendaftaran memang milik nama & kelas di cookie
  if (
    target.nama.toLowerCase() === namaCookie &&
    target.kelas.toLowerCase() === kelasCookie
  ) {
    // Hapus pendaftaran dari array memori server
    pendaftar.splice(index, 1);

    // Perbarui tampilan secara instan di ketiga halaman terkait
    revalidatePath("/saya");
    revalidatePath("/ekskul");
    revalidatePath(`/ekskul/${target.ekskulId}`);
  }
}
