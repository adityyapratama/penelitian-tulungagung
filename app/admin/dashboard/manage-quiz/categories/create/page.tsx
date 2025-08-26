"use client";

import React, { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CreateQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@heroui/react";

// Asumsikan tipe ActionResult Anda seperti ini
type ActionResult = {
  success?: string;
  error?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]" suppressHydrationWarning>
      {pending ? "Menyimpan..." : "Simpan Kategori"}
    </Button>
  );
}

export default function CreateCategoryPage() {
  // 1. Initial state lebih baik kosong agar tidak memicu efek samping
  const initialState: ActionResult = {};
  const [state, formAction] = useActionState<ActionResult, FormData>(CreateQuizCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // 2. Reset form HANYA JIKA ada pesan sukses
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <form ref={formRef} action={formAction}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Tambah Kategori Quiz Baru</CardTitle>
                  <CardDescription>Isi detail di bawah ini untuk membuat kategori baru.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* 3. Tampilkan alert HANYA JIKA ada pesan sukses ATAU error */}
                  {(state?.success || state?.error) && (
                    <Alert
                      color={state.error ? "danger" : "success"}
                      title={state.error || state.success} // Tampilkan pesan error atau sukses
                      suppressHydrationWarning 
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nama_kategori" className="font-semibold">Nama Kategori</Label>
                    <Input
                      id="nama_kategori"
                      name="nama_kategori"
                      placeholder="Contoh: Sejarah Kemerdekaan"
                      required
                      suppressHydrationWarning 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deskripsi" className="font-semibold">Deskripsi (Opsional)</Label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      placeholder="Jelaskan sedikit tentang kategori ini..."
                      className="w-full px-3 py-2 text-sm border rounded-md shadow-sm border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      suppressHydrationWarning 
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
          </div>
        </div>
      </div>
    </div>
  );
}