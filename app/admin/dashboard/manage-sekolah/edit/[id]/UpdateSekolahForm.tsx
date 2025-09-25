"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, School } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/actions"

interface UpdateSekolahFormProps {
  sekolah: {
    sekolah_id: number
    nama_sekolah: string
    alamat_sekolah: string
  }
}

export default function UpdateSekolahForm({ sekolah }: UpdateSekolahFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(false)

    try {
      const result = await updateSekolah(null, formData, sekolah.sekolah_id.toString())
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/dashboard/manage-sekolah")
        }, 1000)
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui sekolah")
    }
  }

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Edit Sekolah</h1>
          <p className="text-muted-foreground">Perbarui informasi sekolah</p>
        </div>

        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="w-5 h-5" />
              Data Sekolah
            </CardTitle>
            <CardDescription>Update nama dan alamat sekolah</CardDescription>
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
                    <p className="text-sm font-medium text-green-800">Sekolah berhasil diperbarui!</p>
                  </div>
                </div>
              )}

              {/* Nama Sekolah */}
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

              {/* Alamat Sekolah */}
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
                <Button type="submit" className="w-full">
                  Update Sekolah
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
