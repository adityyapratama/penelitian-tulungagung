"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { CreateMember, type MemberFormState } from "@/app/(member)/lib/actions"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CircleAlert, ArrowLeft, UploadCloud, X, CalendarDays, School, User, Info, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Data"}
    </Button>
  )
}

export default function CreateMemberPage() {
  const router = useRouter()
  const initialState: MemberFormState = {}
  const [state, formAction] = useActionState(CreateMember, initialState)

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success("Member berhasil dibuat!")
      setImagePreview(null)
      setTimeout(() => {
        router.push("/admin/dashboard/manage-members")
      }, 1500)
    }
    if (state?.error) {
      toast.error(state.error)
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
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl border-0">
            <form action={formAction}>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Tambah Member Baru</CardTitle>
                <CardDescription className="text-base">
                  Lengkapi informasi di bawah ini untuk menambahkan member baru
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {state.error && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg bg-destructive/10 border-destructive/20 text-destructive">
                    <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Terjadi Kesalahan</p>
                      <p className="mt-1 text-sm">{state.error}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  {/* Sekolah */}
                  <div className="space-y-3">
                    <Label htmlFor="sekolah" className="flex items-center gap-2 text-sm font-medium">
                      <School className="w-4 h-4" />
                      Sekolah
                    </Label>
                    <Select name="sekolah">
                      <SelectTrigger id="sekolah" className="h-11">
                        <SelectValue placeholder="Pilih sekolah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">SMA 1 Jakarta</SelectItem>
                        <SelectItem value="2">SMA 2 Bandung</SelectItem>
                        <SelectItem value="3">SMA 3 Surabaya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* NIS */}
                  <div className="space-y-3">
                    <Label htmlFor="nis" className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4" />
                      NIS
                    </Label>
                    <Input id="nis" name="nis" placeholder="Masukkan NIS siswa" className="h-11" />
                  </div>

                  {/* Foto Profil */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      Foto Profil
                    </Label>
                    <Label
                      htmlFor="foto_profile"
                      className="relative flex items-center justify-center w-full h-48 overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/30 hover:border-primary"
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Preview Foto"
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
                              const inputFile = document.getElementById("foto_profile") as HTMLInputElement
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
                          <p className="text-sm font-bold">Klik untuk memilih foto</p>
                          <p className="text-xs">PNG, JPG, GIF (maks. 5MB)</p>
                        </div>
                      )}
                    </Label>
                    <Input
                      id="foto_profile"
                      name="foto_profile"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-3">
                    <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium">
                      <Info className="w-4 h-4" />
                      Bio
                    </Label>
                    <Textarea id="bio" name="bio" placeholder="Tuliskan bio singkat..." rows={3} />
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="space-y-3">
                    <Label htmlFor="tanggal_lahir" className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="w-4 h-4" />
                      Tanggal Lahir
                    </Label>
                    <Input id="tanggal_lahir" name="tanggal_lahir" type="date" className="h-11" />
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="space-y-3">
                    <Label htmlFor="jenis_kelamin" className="flex items-center gap-2 text-sm font-medium">
                      Jenis Kelamin
                    </Label>
                    <Select name="jenis_kelamin">
                      <SelectTrigger id="jenis_kelamin" className="h-11">
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minat */}
                  <div className="space-y-3">
                    <Label htmlFor="minat" className="flex items-center gap-2 text-sm font-medium">
                      <Heart className="w-4 h-4" />
                      Minat
                    </Label>
                    <Textarea id="minat" name="minat" placeholder="Tuliskan minat atau hobi siswa..." rows={3} />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-6 bg-slate-50/50 dark:bg-slate-800/50">
                <Button variant="outline" asChild className="min-w-[120px] bg-transparent">
                  <Link href="/admin/dashboard/manage-members">
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
    </div>
  )
}
