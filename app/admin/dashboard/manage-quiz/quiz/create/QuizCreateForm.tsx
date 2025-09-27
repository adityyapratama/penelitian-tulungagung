"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import Image from "next/image" // <-- Tambahkan import Image
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, BookOpen, ListChecks, ImageIcon, UploadCloud, X } from "lucide-react" // <-- Tambahkan import ikon
import { CreateQuiz } from "@/app/admin/dashboard/manage-quiz/lib/actions"

// Komponen Tombol Submit (sudah bagus, tidak ada perubahan)
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
          Membuat Kuis...
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 mr-2" />
          Buat Kuis
        </>
      )}
    </Button>
  )
}

// Form Utama
export default function CreateQuizForm({ categories }: { categories: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null); // <-- Perbaikan: inisialisasi dengan null
  const router = useRouter()

  // Fungsi untuk handle preview gambar
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
    setError(null)
    setSuccess(false)
    try {
      const result = await CreateQuiz(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/dashboard/manage-quiz/quiz')
        }, 1500)
      }
    } catch {
      setError("Terjadi kesalahan saat membuat kuis")
    }
  }

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5" />
          Buat Kuis Baru
        </CardTitle>
        <CardDescription>Isi informasi lengkap kuis Anda di bawah ini.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {error && (
            <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">Kuis berhasil dibuat!</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="judul">Judul Kuis</Label>
            <Input id="judul" name="judul" placeholder="Contoh: Kuis Sejarah Indonesia" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Jelaskan secara singkat tentang kuis ini..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kategori_id">Kategori</Label>
              <select
                id="kategori_id"
                name="kategori_id"
                className="w-full p-2 border rounded-md bg-background"
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
              <Label htmlFor="xp_reward" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                XP Reward
              </Label>
              <Input id="xp_reward" name="xp_reward" type="number" min="0" placeholder="Contoh: 100" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Status Publikasi</Label>
            <select
              id="is_published"
              name="is_published"
              className="w-full p-2 border rounded-md bg-background"
              required
              defaultValue="true" // Default ke "Ya"
            >
              <option value="true">Publikasikan</option>
              <option value="false">Simpan sebagai Draft</option>
            </select>
          </div>

          {/* Bagian Thumbnail (disesuaikan seperti form edit) */}
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
                    src={imagePreview}
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
                      e.preventDefault();
                      const inputFile = document.getElementById("thumbnail") as HTMLInputElement;
                      if (inputFile) inputFile.value = "";
                      setImagePreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-bold">Klik untuk memilih gambar</p>
                  <p className="text-xs">JPG, PNG, WEBP (Maks. 5MB)</p>
                </div>
              )}
            </Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange} // <-- Hubungkan ke fungsi handler
            />
            <p className="text-sm text-muted-foreground">
              Thumbnail akan menjadi gambar sampul untuk kuis Anda.
            </p>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}