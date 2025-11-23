"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Star, UploadCloud, X, Loader2, CircleAlert } from "lucide-react";
import { UpdateQuiz, QuizActionResult } from "../lib/actions"; 
import Image from "next/image";
import { toast } from "sonner";

type QuizData = {
  kuis_id: number;
  judul: string;
  deskripsi: string | null;
  kategori_id: number | null;
  xp_reward: number;
  is_published: boolean;
  thumbnail: string | null;
};

type CategoryData = {
  kategori_id: number;
  nama_kategori: string;
};

interface EditQuizFormProps {
  quiz: QuizData;
  categories: CategoryData[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Simpan Perubahan"
      )}
    </Button>
  );
}

export function EditQuizForm({ quiz, categories }: EditQuizFormProps) {
  const updateQuizWithId = UpdateQuiz.bind(null, quiz.kuis_id.toString());
  
  const [state, formAction] = useActionState<QuizActionResult, FormData>(
    updateQuizWithId,
    {}
  );

  const [imagePreview, setImagePreview] = useState<string | null>(quiz.thumbnail);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast.error("Gagal update", { description: state.error });
    }

    if (state.success) {
      toast.success("Berhasil!", { description: state.success });
      setTimeout(() => {
        router.push("/guru/dashboard/manage-quiz");
        router.refresh();
      }, 1000);
    }
  }, [state, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar", { description: "Ukuran maksimal 5MB." });
        e.target.value = '';
        return;
      }
      
      setIsImageRemoved(false);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>Detail Kuis</CardTitle>
        <CardDescription>Ubah informasi kuis Anda di bawah ini</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-6">
          
          <input type="hidden" name="is_image_removed" value={isImageRemoved.toString()} />

          <div className="space-y-2">
            <Label htmlFor="judul">Judul Kuis</Label>
            <Input id="judul" name="judul" defaultValue={quiz.judul} />
            {state.errors?.judul && (
              <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                <CircleAlert className="w-4 h-4" />
                {state.errors.judul[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea 
              id="deskripsi" 
              name="deskripsi" 
              defaultValue={quiz.deskripsi ?? ""} 
              rows={4} 
              className="resize-none"
            />
             {state.errors?.deskripsi && (
              <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                <CircleAlert className="w-4 h-4" />
                {state.errors.deskripsi[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <div className="space-y-2">
               <Label htmlFor="kategori_id">Kategori</Label>
               <select
                 id="kategori_id"
                 name="kategori_id"
                 defaultValue={quiz.kategori_id?.toString() ?? ""}
                 className="w-full p-2 border rounded-md bg-background"
               >
                 <option value="" >-- Pilih Kategori --</option>
                 {categories.map((cat) => (
                   <option key={cat.kategori_id} value={cat.kategori_id}>
                     {cat.nama_kategori}
                   </option>
                 ))}
               </select>
               {state.errors?.kategori_id && (
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <CircleAlert className="w-4 h-4" />
                  {state.errors.kategori_id[0]}
                </p>
              )}
             </div>

             <div className="space-y-2">
                 <Label htmlFor="xp_reward" className="flex items-center gap-2">
                   <Star className="w-4 h-4" />
                   XP Reward / Kesulitan
                 </Label>
                 <select
                   id="xp_reward"
                   name="xp_reward"
                   defaultValue={quiz.xp_reward?.toString() ?? ""}
                   className="w-full p-2 border rounded-md bg-background"
                 >
                   <option value="" disabled>-- Pilih Kesulitan --</option>
                   <option value="100">Easy (100 XP)</option>
                   <option value="150">Medium (150 XP)</option>
                   <option value="200">Hard (200 XP)</option>
                 </select>
                 {state.errors?.xp_reward && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.xp_reward[0]}
                  </p>
                )}
               </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Status Publikasi</Label>
            <select
              id="is_published"
              name="is_published"
              defaultValue={quiz.is_published ? "true" : "false"}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="true">Publikasikan</option>
              <option value="false">Simpan sebagai Draft</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Kuis
            </Label>
            <Label
              htmlFor="thumbnail"
              className={`relative flex items-center justify-center w-full h-48 overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer ${
                state.errors?.thumbnail
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-muted-foreground/30 hover:border-primary"
              }`}
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
                      e.preventDefault()
                      const inputFile = document.getElementById("thumbnail") as HTMLInputElement
                      if (inputFile) inputFile.value = ""
                      setImagePreview(null)
                      setIsImageRemoved(true)
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
            {state.errors?.thumbnail && (
              <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                <CircleAlert className="w-4 h-4" />
                {state.errors.thumbnail[0]}
              </p>
            )}
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}