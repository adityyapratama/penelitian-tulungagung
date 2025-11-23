"use client"; // Needs to be client for form interactions

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
// Updated Path
import { CreateQuizCategory } from "../../lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  UploadCloud,
  X,
  CircleAlert,
  Info,
  Loader2, // Added Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import

type ActionResult = {
  success?: string; // Changed from message to success for consistency
  error?: string;
  errors?: {
    nama_kategori?: string[];
    deskripsi?: string[];
    thumbnail?: string[]; // Assuming thumbnail might be added later
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[150px]">
      {pending ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Menyimpan...
        </>
      ) : (
        "Simpan Kategori"
      )}
    </Button>
  );
}

// Renamed component for clarity
export default function CreateQuizCategoryPage() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    CreateQuizCategory,
    {}
  );
  // Removed image state as it wasn't used in the original form logic
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.error || state.errors) {
      toast.error("Gagal menyimpan", {
        description: state.error || "Silakan periksa kembali isian form Anda.",
      });
    }

    if (state.success) { // Check for success
      toast.success("Berhasil!", {
        description: state.success,
      });

      formRef.current?.reset();
      // Removed image state resets

      setTimeout(() => {
        // Updated Path
        router.push("/guru/dashboard/manage-quiz/categories");
        router.refresh();
      }, 1500);
    }
  }, [state, router]);


  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
       {/* Header with Back Button */}
       <div className="flex items-center gap-4 mb-6">
           <Button variant="outline" size="icon" asChild>
             {/* Updated Path */}
             <Link href="/guru/dashboard/manage-quiz/categories">
               <ArrowLeft className="h-4 w-4" />
             </Link>
           </Button>
         <div>
           <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
             Tambah Kategori Kuis Baru
           </h1>
           <p className="text-muted-foreground">
             Buat kategori baru untuk mengelompokkan kuis Anda.
           </p>
         </div>
       </div>

      <div>
        <form ref={formRef} action={formAction} className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>
                Isi nama dan deskripsi untuk kategori kuis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_kategori">Nama Kategori</Label>
                <Input
                  id="nama_kategori"
                  name="nama_kategori"
                  placeholder="e.g Sejarah Lokal, Matematika Dasar"
                   // Added required
                />
                {state.errors?.nama_kategori && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.nama_kategori[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                {/* Changed to Textarea for better description input */}
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  placeholder="Jelaskan singkat mengenai kategori kuis ini..."
                  rows={3}
                  className="resize-none"
                />
                {state.errors?.deskripsi && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <CircleAlert className="w-4 h-4" />
                    {state.errors.deskripsi[0]}
                  </p>
                )}
              </div>
               {/* Thumbnail section removed as per original component logic */}
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t">
              <Button variant="outline" asChild>
                {/* Updated Path */}
                <Link href="/guru/dashboard/manage-quiz/categories">
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
  );
}