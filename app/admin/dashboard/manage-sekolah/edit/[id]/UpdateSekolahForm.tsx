"use client";

import { useState, useRef } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/actions";

interface UpdateSekolahFormProps {
  sekolah: {
    sekolah_id: number;
    nama_sekolah: string;
    alamat_sekolah: string;
  };
}

export default function UpdateSekolahForm({ sekolah }: UpdateSekolahFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateSekolah(
        null,
        formData,
        sekolah.sekolah_id.toString()
      );
      if (result?.error) {
        toast.error("Gagal Memperbarui", { description: result.error });
      } else {
        toast("Berhasil Diperbarui!", {
          description: `Data untuk ${sekolah.nama_sekolah} telah diperbarui.`,
          icon: <Info className="h-5 w-5" />,
          classNames: {
            toast: "bg-primary text-primary-foreground border-border",
          },
        });

        setTimeout(() => {
          router.push("/admin/dashboard/manage-sekolah");
          router.refresh();
        }, 1500);
      }
    } catch (e) {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal terhubung ke server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="w-5 h-5" />
          Data Sekolah
        </CardTitle>
        <CardDescription>Perbarui nama dan alamat sekolah</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
            <Input
              id="nama_sekolah"
              name="nama_sekolah"
              defaultValue={sekolah.nama_sekolah}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat_sekolah">Alamat Sekolah</Label>
            <Textarea
              id="alamat_sekolah"
              name="alamat_sekolah"
              defaultValue={sekolah.alamat_sekolah}
              rows={3}
              required
              className="resize-none bg-background"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
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
                  Memperbarui...
                </>
              ) : (
                "Update Sekolah"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
