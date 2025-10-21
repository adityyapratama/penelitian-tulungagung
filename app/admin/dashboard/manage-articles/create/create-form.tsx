"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SchemaArticle } from "@/lib/schema";
import { CreateArticle } from "../lib/actions";

const ClientSchema = SchemaArticle.extend({
  kategori: z.coerce
    .number({ invalid_type_error: "Kategori harus dipilih." })
    .min(1, { message: "Silakan pilih salah satu kategori." }),
});

type FormData = z.infer<typeof ClientSchema>;

interface CreateArticleFormProps {
  categories: Array<{ KategoriArtikel_id: number; nama_kategori: string }>;
}

export function CreateArticleForm({ categories }: CreateArticleFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      judul: "",
      konten: "",
      kategori: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("konten", data.konten);
    formData.append("kategori", data.kategori.toString());
    formData.append("thumbnail", data.thumbnail as File);

    startTransition(async () => {
      const result = await CreateArticle(null, formData);

      if (result?.error) {
        toast.error("Gagal membuat artikel", {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success("Artikel berhasil dibuat!", {
          description: "Anda akan segera dialihkan...",
        });

        setTimeout(() => {
          router.push("/admin/dashboard/manage-articles");
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Judul */}
      <div className="space-y-2">
        <Label htmlFor="judul">Judul Artikel *</Label>
        <Input
          id="judul"
          placeholder="Masukkan judul artikel..."
          {...form.register("judul")}
        />
        {form.formState.errors.judul?.message && (
          <p className="text-sm text-red-500">
            {String(form.formState.errors.judul.message)}{" "}
            {/* ✅ Dikonversi ke string */}
          </p>
        )}
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori *</Label>
        <select
          id="kategori"
          {...form.register("kategori")}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.KategoriArtikel_id} value={cat.KategoriArtikel_id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>
        {form.formState.errors.kategori?.message && (
          <p className="text-sm text-red-500">
            {String(form.formState.errors.kategori.message)} {/* ✅ Fix */}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail *</Label>
        <Controller
          name="thumbnail"
          control={form.control}
          render={({ field }) => (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files?.[0])}
            />
          )}
        />
        {form.formState.errors.thumbnail?.message && (
          <p className="text-sm text-red-500">
            {String(form.formState.errors.thumbnail.message)} {/* ✅ Fix */}
          </p>
        )}
      </div>

      {/* Konten */}
      <div className="space-y-2">
        <Label htmlFor="konten">Konten Artikel *</Label>
        <Textarea
          id="konten"
          placeholder="Tulis isi artikel di sini..."
          {...form.register("konten")}
          rows={10}
        />
        {form.formState.errors.konten?.message && (
          <p className="text-sm text-red-500">
            {String(form.formState.errors.konten.message)} {/* ✅ Fix */}
          </p>
        )}
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} className="min-w-[150px]">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Artikel
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
