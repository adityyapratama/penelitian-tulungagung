"use client";

import { useActionState,  useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdatePuzzle, type PuzzleFormState } from "../lib/actions";
import { Puzzle as PuzzleType } from "@/lib/generated/prisma";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CircleAlert, Puzzle, ImageIcon, Tag, Star, UploadCloud, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export default function EditPuzzleForm({ puzzle }: { puzzle: PuzzleType }) {
  const initialState: PuzzleFormState = {};
  const router = useRouter();
  
  // State untuk menyimpan URL preview gambar baru
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const updatePuzzleWithId = UpdatePuzzle.bind(null, puzzle.puzzle_id.toString());
  const [state, formAction] = useActionState(updatePuzzleWithId, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Puzzle berhasil diperbarui!");
      setTimeout(() => {
        router.push("/admin/dashboard/manage-puzzles");
      }, 1500);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };
  
  // Membersihkan object URL untuk mencegah memory leak
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full border-0 max-w-5xl">
            <form action={formAction}>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Edit Puzzle</CardTitle>
                <CardDescription className="text-base">
                  Perbarui informasi untuk puzzle {puzzle.judul}.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {state.message && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                    <CircleAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Terjadi Kesalahan</p>
                      <p className="text-sm mt-1">{state.message}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  {/* Judul Input */}
                  <div className="space-y-3">
                    <Label htmlFor="judul" className="text-sm font-medium flex items-center gap-2">
                      <Puzzle className="w-4 h-4" />
                      Judul Puzzle
                    </Label>
                    <Input id="judul" name="judul" defaultValue={puzzle.judul} className="h-11" />
                    {state.errors?.judul && (
                      <p className="text-sm font-medium text-destructive">{state.errors.judul[0]}</p>
                    )}
                  </div>

                  {/* Gambar Input dengan Preview Interaktif */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Gambar Puzzle
                    </Label>
                    <Label 
                      htmlFor="gambar" 
                      className="relative w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors bg-muted/50"
                    >
                      {imagePreview ? ( // Jika ada preview dari file baru
                        <Image src={imagePreview} alt="Preview baru" fill className="object-contain" />
                      ) : puzzle.gambar ? ( // Jika tidak ada preview baru, tampilkan gambar lama
                        <Image src={puzzle.gambar} alt="Gambar saat ini" fill className="object-contain" />
                      ) : ( // Jika tidak ada sama sekali
                        <div className="text-center text-muted-foreground">
                          <UploadCloud className="mx-auto h-10 w-10 mb-2" />
                          <p className="text-sm font-bold">Klik untuk memilih gambar</p>
                        </div>
                      )}
                       <Button 
                          type="button"
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 z-10 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault(); 
                            const inputFile = document.getElementById('gambar') as HTMLInputElement;
                            if (inputFile) inputFile.value = "";
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                    </Label>
                    <Input id="gambar" name="gambar" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                    {state.errors?.gambar && (
                      <p className="text-sm font-medium text-destructive">{state.errors.gambar[0]}</p>
                    )}
                  </div>

                  {/* Kategori Select dengan Ikon */}
                  <div className="space-y-3">
                    <Label htmlFor="kategori" className="text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Kategori
                    </Label>
                    <Select name="kategori" defaultValue={puzzle.kategori}>
                      <SelectTrigger id="kategori" className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {/* Tambahkan ikon di setiap SelectItem */}
                        <SelectItem value="Tempat_Wisata">
                          <div className="flex items-center gap-2"><span>🏖️</span><div>Tempat Wisata</div></div>
                        </SelectItem>
                        <SelectItem value="Tokoh_Sejarah">
                          <div className="flex items-center gap-2"><span>👑</span><div>Tokoh Sejarah</div></div>
                        </SelectItem>
                        <SelectItem value="Peta">
                          <div className="flex items-center gap-2"><span>🗺️</span><div>Peta</div></div>
                        </SelectItem>
                        <SelectItem value="Budaya">
                          <div className="flex items-center gap-2"><span>🎭</span><div>Budaya</div></div>
                        </SelectItem>
                        <SelectItem value="Lainnya">
                          <div className="flex items-center gap-2"><span>🧩</span><div>Lainnya</div></div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.kategori && (
                      <p className="text-sm font-medium text-destructive">{state.errors.kategori[0]}</p>
                    )}
                  </div>

                  {/* XP Reward Input */}
                  <div className="space-y-3">
                    <Label htmlFor="xp_reward" className="text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      XP Reward
                    </Label>
                    <Input id="xp_reward" name="xp_reward" type="number" defaultValue={puzzle.xp_reward} className="h-11" />
                    {state.errors?.xp_reward && (
                      <p className="text-sm font-medium text-destructive">{state.errors.xp_reward[0]}</p>
                    )}
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
    </div>
  );
}