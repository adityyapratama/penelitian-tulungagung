"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, BookOpen, ListChecks, ImageIcon, UploadCloud, X, CircleAlert } from "lucide-react";
import { UpdateQuiz } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import { prisma } from "@/lib/generated/prisma";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Simpan Perubahan"
      )}
    </Button>
  );
}

interface EditQuizFormProps {
  quiz: any;
  categories: any[];
}

export function EditQuizForm({ quiz, categories }: EditQuizFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(quiz.thumbnail);
  const router = useRouter();

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

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    try {
      const result = await UpdateQuiz(quiz.kuis_id.toString(), formData);
      if (result?.error) {
        setError(typeof result.error === "string" ? result.error : "Terjadi kesalahan.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard/manage-quiz/quiz");
        }, 1500);
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui kuis");
    }
  };

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>Detail Kuis</CardTitle>
        <CardDescription>Ubah informasi kuis Anda di bawah ini</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Perhatikan: encType="multipart/form-data" agar file bisa dikirim */}
        <form action={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600">Kuis berhasil diperbarui!</p>}

          <div className="space-y-2">
            <Label htmlFor="judul">Judul Kuis</Label>
            <Input id="judul" name="judul" defaultValue={quiz.judul} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" name="deskripsi" defaultValue={quiz.deskripsi || ""} required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori_id">Kategori</Label>
            <select
              id="kategori_id"
              name="kategori_id"
              defaultValue={quiz.kategori_id?.toString()}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.kategori_id} value={cat.kategori_id}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp_reward">XP Reward</Label>
            <Input id="xp_reward" name="xp_reward" type="number" defaultValue={quiz.xp_reward} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Publikasikan?</Label>
            <select
              id="is_published"
              name="is_published"
              defaultValue={quiz.is_published ? "1" : "0"}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          {/* Thumbnail */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Kuis
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

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}