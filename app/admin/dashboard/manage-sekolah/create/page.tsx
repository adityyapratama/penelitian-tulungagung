"use client";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { School, Info } from "lucide-react";
import { createSekolah } from "../lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Menambah...
        </>
      ) : (
        "Tambah Sekolah"
      )}
    </Button>
  );
}

export default function CreateSekolahForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createSekolah(null, formData);
      if (result?.error) {
        toast.error("Gagal Menambah Sekolah", {
          description: result.error,
        });
      } else {
        toast("Berhasil Ditambahkan!", {
          description: "Data sekolah baru telah disimpan.",
          icon: <Info className="h-5 w-5" />,
          classNames: {
            toast: "bg-primary text-primary-foreground border-border",
          },
        });

        formRef.current?.reset();

        setTimeout(() => {
          router.push("/admin/dashboard/manage-sekolah");
          router.refresh();
        }, 1500);
      }
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak dapat terhubung ke server.",
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Tambah Sekolah</h1>
        <p className="text-muted-foreground">
          Isi informasi detail untuk menambahkan sekolah baru
        </p>
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            Data Sekolah
          </CardTitle>
          <CardDescription>Masukkan nama dan alamat sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleSubmit} className="space-y-6">
            {/* Nama Sekolah */}
            <div className="space-y-2">
              <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
              <Input
                id="nama_sekolah"
                name="nama_sekolah"
                placeholder="Contoh: SMA Negeri 2 Tulungagung"
                required
                className="bg-background"
              />
            </div>

            {/* Alamat Sekolah */}
            <div className="space-y-2">
              <Label htmlFor="alamat_sekolah">Alamat Sekolah</Label>
              <Textarea
                id="alamat_sekolah"
                name="alamat_sekolah"
                placeholder="Jl. Merdeka No. 10, Tulungagung"
                rows={3}
                required
                className="resize-none bg-background"
              />
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
