"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { createPuzzle, type PuzzleFormState } from "../lib/actions"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CircleAlert, Puzzle, ImageIcon, Tag, Star, X, UploadCloud, Play, Eye, EyeOff } from "lucide-react" // [BARU] Tambah icon
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" // [BARU] Import Switch
import toast from "react-hot-toast"
import Image from "next/image"
import PuzzleDemo from "../_components/puzzle-demo"
import { useRouter } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Puzzle"}
    </Button>
  )
}

export default function CreatePuzzlePage() {
  const router = useRouter()
  const initialState: PuzzleFormState = {}
  const [state, formAction] = useActionState(createPuzzle, initialState)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPuzzleDemo, setShowPuzzleDemo] = useState(false)
  
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    if (state?.success) {
      toast.success("Puzzle berhasil dibuat!")
      setImagePreview(null)
      setTimeout(() => {
        router.push("/admin/dashboard/manage-puzzles")
      }, 1500)
    }
    if (state?.message && !state.errors) {
      toast.error(state.message)
    }
  }, [state, router])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    } else {
      setImagePreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <div className="min-h-screen ">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl border-0">
            <form action={formAction}>
              <CardHeader className="pb-6 ">
                <CardTitle className="text-2xl font-bold">Tambah Puzzle Baru</CardTitle>
                <CardDescription className="text-base">
                  Lengkapi informasi di bawah ini untuk membuat puzzle baru dalam sistem
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {state.message && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg bg-destructive/10 border-destructive/20 text-destructive">
                    <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Terjadi Kesalahan</p>
                      <p className="mt-1 text-sm">{state.message}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  {/* Judul Input */}
                  <div className="space-y-3">
                    <Label htmlFor="judul" className="flex items-center gap-2 text-sm font-medium">
                      <Puzzle className="w-4 h-4" />
                      Judul Puzzle
                    </Label>
                    <Input
                      id="judul"
                      name="judul"
                      placeholder="Masukkan judul puzzle (contoh: Teka-teki Matematika)"
                      className="h-11"
                    />
                    {state.errors?.judul && (
                      <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.judul[0]}
                      </p>
                    )}
                  </div>

                  {/* Gambar Input */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <ImageIcon className="w-4 h-4" />
                      Gambar Puzzle
                    </Label>

                    <Label
                      htmlFor="gambar"
                      className="relative flex items-center justify-center w-full h-48 overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/30 hover:border-primary"
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview Puzzle"
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
                              const inputFile = document.getElementById("gambar") as HTMLInputElement
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
                          <p className="text-xs">SVG, PNG, JPG or GIF (maks. 5MB)</p>
                        </div>
                      )}
                    </Label>

                    <Input
                      id="gambar"
                      name="gambar"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />

                    {state.errors?.gambar && (
                      <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.gambar[0]}
                      </p>
                    )}

                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPuzzleDemo(true)}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Demo Puzzle
                      </Button>
                    )}
                  </div>

                  {/* Kategori Select */}
                  <div className="space-y-3">
                    <Label htmlFor="kategori" className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="w-4 h-4" />
                      Kategori
                    </Label>
                    <Select name="kategori">
                      <SelectTrigger id="kategori" className="h-11">
                        <SelectValue placeholder="Pilih kategori puzzle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tempat_Wisata">
                          <div className="flex items-center gap-2">
                            <span>🏖️</span>
                            <div>
                              <div className="font-medium">Tempat Wisata</div>
                              <div className="text-xs text-muted-foreground">Puzzle tentang destinasi wisata</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Tokoh_Sejarah">
                          <div className="flex items-center gap-2">
                            <span>👑</span>
                            <div>
                              <div className="font-medium">Tokoh Sejarah</div>
                              <div className="text-xs text-muted-foreground">Puzzle tentang tokoh bersejarah</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Peta">
                          <div className="flex items-center gap-2">
                            <span>🗺️</span>
                            <div>
                              <div className="font-medium">Peta</div>
                              <div className="text-xs text-muted-foreground">Puzzle tentang geografi dan peta</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Budaya">
                          <div className="flex items-center gap-2">
                            <span>🎭</span>
                            <div>
                              <div className="font-medium">Budaya</div>
                              <div className="text-xs text-muted-foreground">Puzzle tentang budaya dan tradisi</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Lainnya">
                          <div className="flex items-center gap-2">
                            <span>🧩</span>
                            <div>
                              <div className="font-medium">Lainnya</div>
                              <div className="text-xs text-muted-foreground">Puzzle kategori lainnya</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.kategori && (
                      <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.kategori[0]}
                      </p>
                    )}
                  </div>

                  {/* XP Reward Input */}
                  <div className="space-y-3">
                    <Label htmlFor="xp_reward" className="flex items-center gap-2 text-sm font-medium">
                      <Star className="w-4 h-4" />
                      XP Reward
                    </Label>
                    <Input
                      id="xp_reward"
                      name="xp_reward"
                      type="number"
                      min="1"
                      max="1000"
                      placeholder="Masukkan jumlah XP (contoh: 50)"
                      className="h-11"
                    />
                    {state.errors?.xp_reward && (
                      <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <CircleAlert className="w-4 h-4" />
                        {state.errors.xp_reward[0]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      XP yang akan diberikan kepada pengguna setelah menyelesaikan puzzle (1-1000)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        Status Publikasi
                    </Label>
                    <div className="flex items-center p-3 space-x-3 border rounded-md bg-slate-50 dark:bg-slate-800/50 border-border">
                        <Switch
                            id="is_published_switch"
                            name="is_published"
                            value={isPublished ? "1" : "0"}
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
                        />
                        <Label htmlFor="is_published_switch" className="cursor-pointer">
                            {isPublished ? "Puzzle akan ditampilkan untuk umum." : "Puzzle disimpan sebagai draf."}
                        </Label>
                    </div>
                </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-6 bg-slate-50/50 dark:bg-slate-800/50">
                <Button variant="outline" asChild className="min-w-[120px] bg-transparent">
                  <Link href="/admin/dashboard/manage-puzzles">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Batal
                  </Link>
                </Button>
                <SubmitButton />
              </CardFooter>
            </form>
          </div>
        </div>
      </div>

      {showPuzzleDemo && imagePreview && (
        <PuzzleDemo imageUrl={imagePreview} onClose={() => setShowPuzzleDemo(false)} />
      )}
    </div>
  )
}
