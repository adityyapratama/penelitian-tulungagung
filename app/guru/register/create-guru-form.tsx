"use client";

import React, { useState } from "react";
import { CreateGuru, SimpleActionResult } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CircleAlert, School, User, BookOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Sekolah = {
  sekolah_id: number;
  nama_sekolah: string | null;
};

type CreateGuruFormProps = {
  sekolahList: Sekolah[];
  userId: string;
};

export default function CreateGuruForm({ sekolahList, userId }: CreateGuruFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result: SimpleActionResult = await CreateGuru(null, formData);

    setIsSubmitting(false);

    if (result?.success) {
      toast.success(result.success);
      setTimeout(() => {
        router.push("/guru/dashboard");
        router.refresh();
      }, 1000);
    } else if (result?.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      const unknownError = "Terjadi kesalahan tak terduga.";
      setError(unknownError);
      toast.error(unknownError);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl">
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Card className="flex items-center p-3 space-x-2 text-sm text-red-600 rounded-lg bg-red-50 border-none">
              <CircleAlert className="flex-shrink-0 w-5 h-5 text-red-600" />
              <p>{error}</p>
            </Card>
          )}

          <input type="hidden" name="user_id" value={userId} />

          <div>
            <Label
              htmlFor="sekolah_id"
              className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <School className="w-4 h-4 text-primary" />
              Sekolah Tempat Mengajar
            </Label>
            <select
              id="sekolah_id"
              name="sekolah_id"
              className="block w-full px-4 py-3 placeholder-gray-400 transition border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
              defaultValue=""
            >
              <option value="" disabled>
                -- Pilih Sekolah --
              </option>
              {sekolahList.map((item) => (
                <option key={item.sekolah_id} value={item.sekolah_id}>
                  {item.nama_sekolah || `ID: ${item.sekolah_id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label
              htmlFor="nip"
              className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-primary" />
              NIP (Opsional)
            </Label>
            <Input
              id="nip"
              name="nip"
              type="text"
              placeholder="Masukkan NIP Anda (jika ada)"
              className="block w-full px-4 py-3 placeholder-gray-400 transition border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              maxLength={20}
            />
          </div>

          <div>
            <Label
              htmlFor="bidang_ajar"
              className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              Bidang Ajar (Opsional)
            </Label>
            <Input
              id="bidang_ajar"
              name="bidang_ajar"
              placeholder="Contoh: Sejarah Indonesia, Matematika"
              className="block w-full px-4 py-3 placeholder-gray-400 transition border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data Guru"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}