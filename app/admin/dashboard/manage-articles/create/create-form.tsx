"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateArticle } from "../lib/actions";
import { Loader2, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaArticle } from "@/lib/schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof SchemaArticle>;

interface CreateArticleFormProps {
  categories: Array<{ KategoriArtikel_id: number; nama_kategori: string }>;
}

export function CreateArticleForm({ categories }: CreateArticleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(SchemaArticle),
    defaultValues: {
      kategori: categories[0]
        ? BigInt(categories[0].KategoriArtikel_id)
        : BigInt(0),
    },
  });

  const onSubmit = (data: FormData) => {
    setSuccess(null);

    console.log("🚀 Proses menyimpan dimulai...");
    console.log("✅ Data hasil validasi react-hook-form:", data);

    // bungkus ke FormData sebelum ke server action
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("konten", data.konten);
    formData.append("kategori", data.kategori.toString());
    formData.append("thumbnail", data.thumbnail as File);

    console.log(
      "📦 FormData siap dikirim ke server:",
      Object.fromEntries(formData.entries())
    );

    startTransition(async () => {
      try {
        const result = await CreateArticle(null, formData);
        console.log("📥 Respons dari server:", result);

        if (result?.error) {
          console.error("❌ Error dari server:", result.error);
          form.setError("judul", { message: result.error });
          return;
        }

        setSuccess("Artikel berhasil disimpan!");
        router.push("/admin/dashboard/manage-articles");
      } catch (err) {
        console.error("🔥 Terjadi error saat memanggil CreateArticle:", err);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("🔥 FORM DIKIRIM!");
        form.handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md">
          {success}
        </div>
      )}
      {/* Judul */}
      <div className="space-y-2">
        <Label htmlFor="judul">Judul Artikel *</Label>
        <Input id="judul" {...form.register("judul")} required />
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori *</Label>
        <select
          id="kategori"
          {...form.register("kategori", {
            setValueAs: (v) => (v ? BigInt(v) : BigInt(0)),
          })}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.KategoriArtikel_id} value={cat.KategoriArtikel_id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>
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
              required
            />
          )}
        />
        {/* <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          {...form.register("thumbnail")}
          required
        /> */}
      </div>

      {/* Konten */}
      <div className="space-y-2">
        <Label htmlFor="konten">Konten Artikel *</Label>
        <Textarea id="konten" {...form.register("konten")} rows={10} required />
      </div>

      <div className="flex justify-end">
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
