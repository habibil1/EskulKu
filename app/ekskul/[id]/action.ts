"use server";

import { ekskul, pendaftar, tambahPendaftar, JAM_SESI } from "@/data/ekskul";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type FormState = {
  values?: { nama: string; kelas: string };
  errors?: { nama?: string; kelas?: string };
  message?: string;
  success?: boolean;
};

export async function daftarAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const ekskulId = Number(formData.get("ekskulId"));
  const nama = formData.get("nama")?.toString().trim() || "";
  const kelas = formData.get("kelas")?.toString().trim() || "";

  // Poin 10: Isian tidak hilang saat galat
  const state: FormState = {
    values: { nama, kelas },
    errors: {},
    success: false,
  };

  let hasFieldError = false;
  if (nama.length < 3) {
    state.errors!.nama = "Nama minimal 3 huruf";
    hasFieldError = true;
  }
  if (kelas.length < 3) {
    state.errors!.kelas = "Kelas minimal 3 karakter";
    hasFieldError = true;
  }
  if (hasFieldError) return state;

  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    state.message = "Ekskul tidak valid atau tidak ditemukan.";
    return state;
  }

  const namaLower = nama.toLowerCase();
  const kelasLower = kelas.toLowerCase();

  const isTerdaftar = pendaftar.some(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === namaLower &&
      p.kelas.toLowerCase() === kelasLower,
  );
  if (isTerdaftar) {
    state.message = `${nama} (${kelas}) sudah terdaftar di ${targetEkskul.nama}.`;
    return state;
  }

  const terisi = pendaftar.filter((p) => p.ekskulId === ekskulId).length;
  if (terisi >= targetEkskul.kuota) {
    state.message = `Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).`;
    return state;
  }

  const studentRegs = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === namaLower &&
      p.kelas.toLowerCase() === kelasLower,
  );

  for (const reg of studentRegs) {
    const e = ekskul.find((x) => x.id === reg.ekskulId);
    if (e && e.hari === targetEkskul.hari && e.sesi === targetEkskul.sesi) {
      state.message = `Jadwal bentrok dengan ${e.nama} (${e.hari}, sesi ${e.sesi}).`;
      return state;
    }
  }

  // --- POIN 11: BILA BERHASIL ---

  // 1. Simpan ke database memori server
  const nomor = tambahPendaftar({ ekskulId, nama, kelas });

  // 2. Simpan di cookie agar kolom terisi otomatis ke depannya
  const cookieStore = await cookies();
  cookieStore.set("nama", nama);
  cookieStore.set("kelas", kelas);

  // 3. Refresh (revalidate) data di latar belakang agar update tanpa F5
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");
  revalidatePath("/saya");

  state.success = true;
  state.message = `Pendaftaran #${nomor} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${JAM_SESI[targetEkskul.sesi]}).`;
  return state;
}
