
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage, Star, BookOpen, CheckCircle } from "lucide-react"
import { createStory } from "../lib/actions"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import Image from "next/image"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Membuat Cerita...
        </>
      ) : (
        <>
          <BookOpen className="mr-2 h-4 w-4" />
          Buat Cerita Interaktif
        </>
      )}
    </Button>
  )
}

export default function CreateStoryForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File terlalu besar. Maksimal 5MB.")
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setError(null)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(false)

    try {
      const result = await createStory(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        setSelectedFile(null)
        setPreviewUrl(null)
      }
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch {
      setError("Terjadi kesalahan saat membuat cerita")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buat Cerita Interaktif</h1>
        <p className="text-muted-foreground">
          Buat cerita interaktif baru dengan thumbnail menarik dan deskripsi yang engaging
        </p>
      </div>

      <Card className="bg-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Detail Cerita
          </CardTitle>
          <CardDescription>Isi informasi lengkap untuk cerita interaktif Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-green-800 text-sm font-medium">Cerita berhasil dibuat!</p>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="judul" className="text-sm font-medium">
                Judul Cerita
              </Label>
              <Input
                id="judul"
                name="judul"
                placeholder="Masukkan judul cerita yang menarik..."
                required
                className="bg-background"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-sm font-medium">
                Thumbnail Cerita
              </Label>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <Label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
                  </Label>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="relative">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                      <FileImage className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-medium">
                        Siap
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview thumbnail"
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi" className="text-sm font-medium">
                Deskripsi Cerita
              </Label>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                placeholder="Tulis deskripsi menarik tentang cerita Anda..."
                rows={4}
                required
                className="bg-background resize-none"
              />
            </div>

            {/* XP Reward */}
            <div className="space-y-2">
              <Label htmlFor="xp_reward" className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                XP Reward
              </Label>
              <Input
                id="xp_reward"
                name="xp_reward"
                type="number"
                min="1"
                max="1000"
                placeholder="100"
                required
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Jumlah XP yang akan diberikan kepada pemain setelah menyelesaikan cerita
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
