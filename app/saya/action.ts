"use server";

import { pendaftar } from "@/data/ekskul";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function batalkanAction(formData: FormData) {
  const nomor = Number(formData.get("nomor"));

  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value?.toLowerCase();
  const kelasCookie = cookieStore.get("kelas")?.value?.toLowerCase();

  if (!namaCookie || !kelasCookie) return;

  const index = pendaftar.findIndex((p) => p.nomor === nomor);
  if (index === -1) return;

  const target = pendaftar[index];

  if (
    target.nama.toLowerCase() === namaCookie &&
    target.kelas.toLowerCase() === kelasCookie
  ) {
    pendaftar.splice(index, 1);

    revalidatePath("/saya");
    revalidatePath("/ekskul");
    revalidatePath(`/ekskul/${target.ekskulId}`);
  }
}
