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
import { toast } from "sonner"; 

type FormData = z.infer<typeof SchemaArticle>;

interface CreateArticleFormProps {
  categories: Array<{ KategoriArtikel_id: number; nama_kategori: string }>;
}

export function CreateArticleForm({ categories }: CreateArticleFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(SchemaArticle),
    mode: "onChange", 
    defaultValues: {
      judul: "",
      konten: "",
      kategori: BigInt(0), 
    },
  });

  const onSubmit = (data: FormData) => {
  
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("konten", data.konten);
    formData.append("kategori", data.kategori.toString());
    formData.append("thumbnail", data.thumbnail as File);

    startTransition(async () => {
      try {
        const result = await CreateArticle(null, formData);

        if (result?.error) {
          toast.error(result.error); 
          return;
        }

        toast.success("Artikel berhasil disimpan!");
        router.push("/guru/dashboard/manage-articles");
      } catch (err) {
        toast.error("Terjadi kesalahan koneksi atau server.");
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      {/* Judul */}
      <div className="space-y-2">
        <Label htmlFor="judul">Judul Artikel *</Label>
        <Input
          id="judul"
          {...form.register("judul")}
          aria-invalid={!!form.formState.errors.judul}
          className={form.formState.errors.judul ? "border-red-500" : ""}
        />
        {form.formState.errors.judul && (
          <p className="text-sm text-red-500">
            {form.formState.errors.judul.message}
          </p>
        )}
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori *</Label>
        <select
          id="kategori"
          {...form.register("kategori", {
            setValueAs: (v) => (v && v !== "" ? BigInt(v) : BigInt(0)), 
          })}
          className={`border rounded p-2 w-full text-sm h-10 ${
            form.formState.errors.kategori ? "border-red-500" : "border-input"
          }`}
        >
          <option value="0">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.KategoriArtikel_id} value={cat.KategoriArtikel_id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>
        {form.formState.errors.kategori && (
          <p className="text-sm text-red-500">
            {form.formState.errors.kategori.message}
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
              className={
                form.formState.errors.thumbnail ? "border-red-500" : ""
              }
            />
          )}
        />
        {form.formState.errors.thumbnail && (
          <p className="text-sm text-red-500">
            Thumbnail wajib diisi dan harus berupa file gambar.
          </p>
        )}
      </div>

      {/* Konten */}
      <div className="space-y-2">
        <Label htmlFor="konten">Konten Artikel *</Label>
        <Textarea
          id="konten"
          {...form.register("konten")}
          rows={10}
          className={form.formState.errors.konten ? "border-red-500" : ""}
        />
        {form.formState.errors.konten && (
          <p className="text-sm text-red-500">
            {form.formState.errors.konten.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"

          disabled={isPending || !form.formState.isValid} 
          className="min-w-[150px]"
        >
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