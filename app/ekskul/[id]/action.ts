"use server";

import { ekskul, pendaftar } from "@/data/ekskul";

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
  state.success = true;
  state.message = "Berhasil! (Fitur simpan akan dilanjutkan di Langkah 11)";
  return state;
}
