"use client";

import { SaveGuruProfile } from "../lib/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, BookOpen, IdCard } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";
import { useEffect, useActionState } from "react"; 


interface ActionState {
  error?: string;
  success?: string;
}

interface GuruData {
  nip: string | null;
  sekolah_id: number | null;
  bidang_ajar: string | null;
}

interface SekolahItem {
  sekolah_id: number;
  nama_sekolah: string | null;
}

interface GuruProfileFormProps {
  guruData: GuruData;
  sekolahList: SekolahItem[];
}

const initialState: ActionState = {
  error: undefined,
  success: undefined,
};

export function GuruProfileForm({
  guruData,
  sekolahList,
}: GuruProfileFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    SaveGuruProfile,
    initialState
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Alert Error Inline */}
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {/* Alert Sukses Inline */}
      {state?.success && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md border border-green-200">
          {state.success}
        </div>
      )}

      {/* Field NIP */}
      <div className="space-y-2">
        <Label htmlFor="nip" className="flex items-center gap-2">
          <IdCard className="w-4 h-4" />
          Nomor Induk Pegawai (NIP)
        </Label>
        <Input
          id="nip"
          name="nip"
          placeholder="Contoh: 19800101 200001 1 001"
          defaultValue={guruData.nip || ""}
          required
        />
        <p className="text-xs text-muted-foreground">
          Pastikan NIP sesuai dengan data kepegawaian sekolah.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sekolah_id" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Sekolah Asal
        </Label>
        <div className="relative">
          <select
            id="sekolah_id"
            name="sekolah_id"
            defaultValue={guruData.sekolah_id?.toString() || ""}
            required
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="" disabled>
              -- Pilih Sekolah --
            </option>
            {sekolahList.map((sekolah) => (
              <option key={sekolah.sekolah_id} value={sekolah.sekolah_id}>
                {sekolah.nama_sekolah ?? "Nama Sekolah Tidak Tersedia"}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bidang_ajar" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Mata Pelajaran / Bidang Ajar
        </Label>
        <Input
          id="bidang_ajar"
          name="bidang_ajar"
          placeholder="Contoh: Sejarah Kebudayaan Islam"
          defaultValue={guruData.bidang_ajar || ""}
          required
        />
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild type="button">
          <Link href="/guru/dashboard">Batal</Link>
        </Button>
        <SubmitButton text="Simpan Perubahan" />
      </div>
    </form>
  );
}