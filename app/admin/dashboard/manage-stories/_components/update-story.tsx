"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { UpdateStory } from "../lib/actions"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Story {
  cerita_id: number
  judul: string
  thumbnail: string | null
  deskripsi: string | null
  xp_reward: number
}

interface UpdateStoryFormProps {
  story: Story
}

export function UpdateStoryForm({ story }: UpdateStoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(story.thumbnail ? story.thumbnail : null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          "File terlalu besar",
          {
          description: "Ukuran file maksimal 5MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await UpdateStory(story.cerita_id.toString(), formData)

      if (result.success) {
        toast.success(
          "Berhasil",{
          description: result.success,
        })
        if (result.redirectTo) {
          router.push(result.redirectTo)
        }
      } else {
        toast.error(
          "Error",{
          description: result.error,
        })
      }
    })
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard/manage-stories")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">Update Story</CardTitle>
        <CardDescription className="text-muted-foreground">Edit informasi story dan simpan perubahan</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="judul" className="text-sm font-medium text-foreground">
              Judul Story
            </Label>
            <Input
              id="judul"
              name="judul"
              defaultValue={story.judul}
              placeholder="Masukkan judul story..."
              required
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-sm font-medium text-foreground">
              Thumbnail
            </Label>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50">
                  <Image src={previewUrl || "/placeholder.svg"} alt="Preview thumbnail" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-border/50 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-sm font-medium text-foreground">
              Deskripsi
            </Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              defaultValue={story.deskripsi!}
              placeholder="Masukkan deskripsi story..."
              required
              rows={4}
              className="border-border/50 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp_reward" className="text-sm font-medium text-foreground">
              XP Reward
            </Label>
            <Input
              id="xp_reward"
              name="xp_reward"
              type="number"
              defaultValue={story.xp_reward}
              placeholder="100"
              required
              min="1"
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="border-border/50 hover:bg-muted/50"
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
