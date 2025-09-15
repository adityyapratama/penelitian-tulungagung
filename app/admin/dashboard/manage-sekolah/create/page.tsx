"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, School } from "lucide-react"
import { useRouter } from "next/navigation"
import { createSekolah } from "../lib/actions"

export default function CreateSekolahForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(false)

    try {
      const result = await createSekolah(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/dashboard/manage-sekolah")
        }, 1000)
      }
    } catch {
      setError("Terjadi kesalahan saat menambah sekolah")
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Tambah Sekolah</h1>
          <p className="text-muted-foreground">Isi informasi detail untuk menambahkan sekolah baru</p>
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
                    <p className="text-sm font-medium text-green-800">
                      Sekolah berhasil ditambahkan!
                    </p>
                  </div>
                </div>
              )}

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
                <Button type="submit" className="w-full">
                  Tambah Sekolah
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
