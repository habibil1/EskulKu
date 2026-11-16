"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { daftarAction } from "./action";

function TombolSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Memproses..." : "Daftar ekskul ini"}
    </button>
  );
}

export default function FormDaftar({
  ekskulId,
  defaultNama,
  defaultKelas,
}: {
  ekskulId: number;
  defaultNama: string;
  defaultKelas: string;
}) {
  const [state, action] = useActionState(daftarAction, {});

  return (
    <form action={action} className="mt-8 rounded-xl border bg-slate-50 p-6">
      <h2 className="mb-4 text-xl font-bold">Daftar ekskul ini</h2>

      <input type="hidden" name="ekskulId" value={ekskulId} />

      <div className="mb-4 flex flex-col gap-1">
        <label htmlFor="nama" className="font-medium text-slate-700">
          Nama
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          defaultValue={state?.values?.nama ?? defaultNama}
          className="rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        {state?.errors?.nama && (
          <span className="text-sm text-red-600">{state.errors.nama}</span>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-1">
        <label htmlFor="kelas" className="font-medium text-slate-700">
          Kelas
        </label>
        <input
          type="text"
          id="kelas"
          name="kelas"
          defaultValue={state?.values?.kelas ?? defaultKelas}
          placeholder="Contoh: XI RPL 1"
          className="rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        {state?.errors?.kelas && (
          <span className="text-sm text-red-600">{state.errors.kelas}</span>
        )}
      </div>

      {state?.message && (
        <div
          className={`rounded p-3 text-sm font-medium ${state.success ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
        >
          {state.message}
        </div>
      )}

      <TombolSubmit />
    </form>
  );
}
