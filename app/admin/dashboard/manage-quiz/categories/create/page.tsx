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
import { useRouter } from "next/navigation"; // 1. Impor useRouter
import { toast } from "sonner"; // Impor toast untuk notifikasi

type ActionResult = {
  message?: string;
  error?: string;
  errors?: {
    nama_kategori?: string[];
    deskripsi?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? "Menyimpan..." : "Simpan Kategori"}
    </Button>
  );
}

export default function CreateCategoryPage() {
  const router = useRouter(); // 2. Panggil hook untuk mendapatkan objek router
  const initialState: ActionResult = {};
  const [state, formAction] = useActionState<ActionResult, FormData>(CreateQuizCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // 3. useEffect yang sudah diperbaiki
  useEffect(() => {
    if (state?.message) {
      // Beri notifikasi sukses instan
      toast.success(state.message);
      formRef.current?.reset();
      // Tunggu sejenak sebelum redirect agar pengguna bisa melihat notifikasi
      setTimeout(() => {
        router.push("/admin/dashboard/manage-quiz/categories");
      }, 500);
    }
    // Tampilkan juga notifikasi jika ada error global
    if (state?.error) {
        toast.error(state.error);
    }
  }, [state, router]); // Tambahkan router ke dependency array

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
                  {/* Alert ini tetap berguna jika redirect gagal atau untuk menampilkan pesan sukses sebelum redirect */}
                  {(state?.message && !state.error) && (
                    <Alert
                      color="success"
                      title={state.message}
                      className="gap-x-3"
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nama_kategori" className="font-semibold">Nama Kategori</Label>
                    <Input
                      id="nama_kategori"
                      name="nama_kategori"
                      placeholder="Contoh: Sejarah Kemerdekaan"
                      required
                    />
                    {state.errors?.nama_kategori && (
                      <p className="text-sm font-medium text-red-500">
                        {state.errors.nama_kategori[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deskripsi" className="font-semibold">Deskripsi (Opsional)</Label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      placeholder="Jelaskan sedikit tentang kategori ini..."
                      className="w-full px-3 py-2 text-sm border rounded-md shadow-sm border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {state.errors?.deskripsi && (
                      <p className="text-sm font-medium text-red-500">
                        {state.errors.deskripsi[0]}
                      </p>
                    )}
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