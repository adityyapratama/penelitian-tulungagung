"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ImageIcon, UploadCloud, X, CircleAlert } from "lucide-react";
import { Alert } from "@heroui/react";
import { ActionResult } from "@/lib/executeAction";
import { KategoriKuis } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}


export function EditCategoryForm({ category }: { category: KategoriKuis }) {
  const router = useRouter();
  const initialState: ActionResult = {};
  const [imagePreview, setImagePreview] = useState<string | null>(category.thumbnail);
  
  async function updateActionWrapper(prevState: ActionResult, formData: FormData) {  
    const result = await UpdateQuizCategory(category.kategori_id.toString(), formData);
    return result;
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const [state, formAction] = useActionState(updateActionWrapper, initialState);

  
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push("/admin/dashboard/manage-quiz/categories");
      }, 1000); 
    }
  }, [state, router]);

  return (
    
    <form action={formAction} encType="multipart/form-data">
      <Card>
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Kategori: {category.nama_kategori}</CardTitle>
          <CardDescription>Ubah detail di bawah ini dan simpan perubahan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(state?.success || state?.error) && (
            <Alert
              color={state.error ? "danger" : "success"}
              title={state.success ? "Perubahan berhasil disimpan!" : state.error}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="nama_kategori" className="font-semibold">Nama Kategori</Label>
            <Input
              id="nama_kategori"
              name="nama_kategori"
              defaultValue={category.nama_kategori}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="font-semibold">Deskripsi (Opsional)</Label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              defaultValue={category.deskripsi || ""}
              className="w-full px-3 py-2 text-sm border rounded-md shadow-sm border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Gambar Input */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Kategori
            </Label>

            <Label
              htmlFor="thumbnail"
              className="relative flex items-center justify-center w-full h-48 overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/30 hover:border-primary"
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview Thumbnail"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute z-10 top-2 right-2 h-7 w-7"
                    onClick={(e) => {
                      // Hentikan event agar tidak memicu dialog file lagi
                      e.preventDefault()
                      const inputFile = document.getElementById("thumbnail") as HTMLInputElement
                      if (inputFile) inputFile.value = ""
                      setImagePreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-bold">Klik untuk memilih gambar</p>
                  <p className="text-xs">JPG, JPEG, PNG, WEBP (maks. 5MB)</p>
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
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/manage-quiz/categories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Batal
            </Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}