"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";      // useActionState dari 'react'
import { useFormStatus } from "react-dom";    // useFormStatus dari 'react-dom'
import { UpdateQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@heroui/react";
import {ActionResult} from "@/lib/executeAction";
import { KategoriKuis } from "@prisma/client";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

// Ini adalah Client Component karena menggunakan hook
export function EditCategoryForm({ category }: { category: KategoriKuis }) {
  const router = useRouter();
  const initialState: ActionResult = {};
  
  // Gunakan .bind untuk membuat action baru yang sudah terisi dengan ID kategori
  const updateCategoryWithId = UpdateQuizCategory.bind(null, category.kategori_id.toString());
  
  const [state, formAction] = useActionState(updateCategoryWithId, initialState);

  // Jika berhasil, kembali ke halaman daftar setelah beberapa saat
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push("/admin/dashboard/manage-quiz/categories");
      }, 1500); // Tunggu 1.5 detik
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Kategori: {category.nama_kategori}</CardTitle>
          <CardDescription>Ubah detail di bawah ini dan simpan perubahan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(state?.success || state?.error) && (
            <Alert
              color={state.error ? "danger" : "success"}
              title={state.success || state.error}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="nama_kategori" className="font-semibold">Nama Kategori</Label>
            <Input
              id="nama_kategori"
              name="nama_kategori"
              defaultValue={category.nama_kategori}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="font-semibold">Deskripsi (Opsional)</Label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              defaultValue={category.deskripsi || ""}
              className="w-full px-3 py-2 text-sm border rounded-md shadow-sm ..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/manage-quiz/categories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Batal
            </Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}