"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileImage, Star, BookOpen, Eye } from "lucide-react";
import { createStory } from "../lib/actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

function SubmitButton() {
  const { pending } = useFormStatus();

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
  );
}

interface Category {
  KategoriId: number;
  NamaKategori: string;
}

interface CreateStoryFormProps {
  categories: Category[];
}

export default function CreateStoryForm({ categories }: CreateStoryFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const [formKey, setFormKey] = useState(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar. Maksimal 5MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
        setSelectedFile(null);
        setPreviewUrl(null);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!formData.get('kategori')) {
        toast.error("Kategori wajib dipilih.");
        return;
    }
    
    try {
      const result = await createStory(null, formData);
      
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      
      if (result?.redirectTo) {
        toast.success("Cerita berhasil dibuat!");
        setFormKey(Date.now());
        setSelectedFile(null);
        setPreviewUrl(null);
        router.push(result.redirectTo);
      }
    } catch {
      toast.error("Terjadi kesalahan saat membuat cerita.");
    }
  };

  if (categories.length === 0) {
    return (
      <p className="text-destructive text-sm p-4 bg-red-50 border border-red-200 rounded-lg">
        Tidak ada kategori tersedia. Silakan hubungi administrator untuk menambahkan kategori.
      </p>
    );
  }

  return (
    <form key={formKey} action={handleSubmit} className="space-y-6">
      
      <div className="space-y-2">
        <Label htmlFor="judul" className="text-sm font-medium">Judul Cerita</Label>
        <Input
          id="judul"
          name="judul"
          placeholder="Masukkan judul cerita yang menarik..."
          required
          className="bg-background"
        />
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="kategori" className="text-sm font-medium">
          Kategori Cerita
        </Label>
        <Select name="kategori" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori cerita" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.KategoriId} value={category.KategoriId.toString()}>
                {category.NamaKategori}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
          placeholder="150"
          required
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">
          Jumlah XP yang akan diberikan kepada pemain setelah menyelesaikan cerita
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="is_published" className="text-sm font-medium flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Status Publikasi
        </Label>
        <div className="flex items-center space-x-3 p-4 border rounded-lg bg-background">
          <Switch id="is_published" name="is_published" />
          <Label htmlFor="is_published" className="font-normal cursor-pointer">
            Publikasikan cerita ini?
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Jika diaktifkan, cerita akan langsung terlihat oleh semua member.
        </p>
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}