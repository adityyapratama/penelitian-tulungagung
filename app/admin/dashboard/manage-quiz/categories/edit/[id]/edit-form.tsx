"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ImageIcon, UploadCloud, X } from "lucide-react";
import { Alert } from "@heroui/react";
import { ActionResult } from "@/lib/executeAction";
import type { KategoriKuis } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

// 🔹 Tombol submit
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="min-w-[140px] bg-primary hover:bg-primary/90 text-white transition-colors duration-200"
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

// 🔹 Komponen utama form edit kategori
export function EditCategoryForm({ category }: { category: KategoriKuis }) {
  const router = useRouter();
  const initialState: ActionResult = {};
  const [imagePreview, setImagePreview] = useState<string | null>(
    (category as any)?.thumbnail ?? null
  );

  // ✅ Fungsi submit utama
  async function updateActionWrapper(
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> {
    const result = await UpdateQuizCategory(
      category.kategori_id.toString(),
      formData
    );

    // Konversi agar sesuai dengan ActionResult lama (success: string)
    if (typeof result?.success === "boolean") {
      return {
        success: result.success ? "true" : "false",
        data: (result as any).data,
      } as ActionResult;
    }

    return result;
  }

  // ✅ useActionState dengan dua generic
  const [state, formAction] = useActionState<ActionResult, FormData>(
    updateActionWrapper,
    initialState
  );

  // ✅ Notifikasi & redirect
  useEffect(() => {
    if (state?.success === "true") {
      toast.success("Perubahan kategori berhasil disimpan! 🎉");
      setTimeout(() => {
        router.push("/admin/dashboard/manage-quiz/categories");
      }, 1000);
    } else if (state?.error) {
      toast.error(state.error || "Terjadi kesalahan saat menyimpan kategori.");
    }
  }, [state, router]);

  // ✅ Preview gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran maksimal 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <form action={formAction} className="w-full">
        <Card className="w-full border border-border shadow-sm bg-card">
          {/* HEADER */}
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-3xl font-bold text-foreground">
              Edit Kategori:{" "}
              <span className="text-primary">{category.nama_kategori}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ubah detail di bawah ini dan simpan perubahan.
            </CardDescription>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="space-y-8 py-6">
            {(state?.success || state?.error) && (
              <Alert
                color={state.error ? "danger" : "success"}
                title={
                  state.success === "true"
                    ? "Perubahan berhasil disimpan!"
                    : state.error
                }
              />
            )}

            {/* Grid dua kolom dengan gap lebih besar untuk full width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Kolom kiri */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="nama_kategori"
                    className="font-semibold text-base"
                  >
                    Nama Kategori
                  </Label>
                  <Input
                    id="nama_kategori"
                    name="nama_kategori"
                    defaultValue={category.nama_kategori}
                    required
                    className="w-full h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="deskripsi"
                    className="font-semibold text-base"
                  >
                    Deskripsi (Opsional)
                  </Label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    defaultValue={category.deskripsi || ""}
                    className="w-full min-h-[180px] px-3 py-2 text-base border rounded-md shadow-sm border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Kolom kanan (upload gambar) */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <ImageIcon className="w-5 h-5" />
                  Thumbnail Kategori
                </Label>

                <Label
                  htmlFor="thumbnail"
                  className="relative flex items-center justify-center w-full h-72 overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/30 hover:border-primary bg-muted/10"
                >
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview Thumbnail"
                        fill
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute z-10 top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault();
                          const inputFile = document.getElementById(
                            "thumbnail"
                          ) as HTMLInputElement;
                          if (inputFile) inputFile.value = "";
                          setImagePreview(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <UploadCloud className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-base font-bold">
                        Klik untuk memilih gambar
                      </p>
                      <p className="text-sm mt-1">
                        JPG, JPEG, PNG, WEBP (maks. 5MB)
                      </p>
                    </div>
                  )}
                </Label>

                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />

                <p className="text-sm text-muted-foreground">
                  Kosongkan jika tidak ingin mengubah gambar.
                </p>
              </div>
            </div>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border bg-muted/10">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/admin/dashboard/manage-quiz/categories">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Batal
              </Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
