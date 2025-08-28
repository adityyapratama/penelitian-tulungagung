"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, BookOpen, ListChecks } from "lucide-react"
import { CreateQuiz } from "@/app/admin/dashboard/manage-quiz/lib/actions"

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

export default function CreateQuizForm({ categories }: { categories: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

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
          Detail Kuis
        </CardTitle>
        <CardDescription>Isi informasi lengkap kuis Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-6">
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
            <Input id="judul" name="judul" placeholder="Masukkan judul kuis..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Tulis deskripsi singkat..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          {/* Dropdown kategori */}
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
            <Input id="xp_reward" name="xp_reward" type="number" min="1" placeholder="100" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Publikasikan?</Label>
            <select
              id="is_published"
              name="is_published"
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
