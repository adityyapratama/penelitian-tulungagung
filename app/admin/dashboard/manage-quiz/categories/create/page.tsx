"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CreateQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions";
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
import {
  ArrowLeft,
  ImageIcon,
  UploadCloud,
  X,
  CircleAlert,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

type ActionResult = {
  message?: string;
  error?: string;
  errors?: {
    nama_kategori?: string[];
    deskripsi?: string[];
    thumbnail?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[150px]">
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Menyimpan...
        </>
      ) : (
        "Simpan Kategori"
      )}
    </Button>
  );
}

export default function CreateCategoryPage() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    CreateQuizCategory,
    {}
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Logika Toast Sonner
  useEffect(() => {
    if (state.error || state.errors) {
      toast.error("Gagal menyimpan", {
        description: state.error || "Silakan periksa kembali isian form Anda.",
      });
    }

    if (state.message) {
      toast("Berhasil!", {
        description: state.message,
        icon: <Info className="h-5 w-5" />,
        classNames: {
          toast: "bg-primary text-primary-foreground border-border",
        },
      });

      formRef.current?.reset();
      setImagePreview(null);
      setImageName(null);

      setTimeout(() => {
        router.push("/admin/dashboard/manage-quiz/categories");
        router.refresh();
      }, 1500);
    }
  }, [state, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    // PERBAIKAN 1: Mengubah layout menjadi full-width
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Tambah Kategori Kuis</h1>
        <p className="text-muted-foreground">
          Buat kategori baru untuk kuis sejarah Tulungagung
        </p>
      </div>

      <div>
        {/* PERBAIKAN 2: Menghapus encType dari form */}
        <form ref={formRef} action={formAction} className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>
                Isi nama dan deskripsi untuk kategori kuis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_kategori">Nama Kategori</Label>
                <Input
                  id="nama_kategori"
                  name="nama_kategori"
                  placeholder="e.g Sejarah Marmer"
                />
                {state.errors?.nama_kategori && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.nama_kategori[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Input
                  id="deskripsi"
                  name="deskripsi"
                  placeholder="Kuis tentang sejarah industri marmer..."
                />
                {state.errors?.deskripsi && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.deskripsi[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <Label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <UploadCloud className="w-10 h-10" />
                      <p className="font-semibold">Klik untuk upload gambar</p>
                      <p className="text-xs">
                        JPG, JPEG, PNG, WEBP (maks. 5MB)
                      </p>
                    </div>
                  )}
                </Label>

                <Input
                  ref={fileInputRef}
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  required
                  className="sr-only"
                  onChange={handleImageChange}
                />

                {state.errors?.thumbnail && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.thumbnail[0]}
                  </p>
                )}
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
      </div>
    </div>
  );
}
