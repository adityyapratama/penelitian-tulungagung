"use client";

import React, { useEffect, useState, useRef } from "react"; // Added useRef
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
// Updated Path
import { UpdateQuizCategory } from "../../../lib/actions";
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
import { ArrowLeft, ImageIcon, UploadCloud, X, Loader2, CircleAlert } from "lucide-react"; // Added Loader2
import { ActionResult } from "../../../lib/actions";
import type { KategoriKuis } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea"; 


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="min-w-[140px]"
    >
      {pending ? (
         <>
           <Loader2 className="animate-spin h-4 w-4 mr-2" />
           Menyimpan...
         </>
        ) : "Simpan Perubahan"}
    </Button>
  );
}

export function EditCategoryForm({ category }: { category: KategoriKuis }) {
  const router = useRouter();
  const initialState: ActionResult = {};
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function updateActionWrapper(
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> {
    // Directly call the action with ID, prevState, and formData
    return await UpdateQuizCategory(
      category.kategori_id.toString(),
      prevState, // Pass previous state
      formData
    );
  }

  const [state, formAction] = useActionState<ActionResult, FormData>(
    updateActionWrapper,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Berhasil!", { description: state.success });
      setTimeout(() => {
        // Updated Path
        router.push("/guru/dashboard/manage-quiz/categories");
        router.refresh();
      }, 1000);
    } else if (state?.error) {
      toast.error("Gagal Menyimpan", { description: state.error });
    }
  }, [state, router]);


  return (
    <div className="w-full">
      <form action={formAction} className="w-full">
        <Card className="w-full border border-border shadow-sm bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-xl font-semibold md:text-2xl text-foreground">
              Edit Kategori:{" "}
              <span className="text-primary">{category.nama_kategori}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ubah detail di bawah ini dan simpan perubahan.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 py-6">
            {/* Removed Alert component as toast handles feedback */}

            <div className="space-y-2">
              <Label
                htmlFor="nama_kategori"
                className="font-semibold"
              >
                Nama Kategori
              </Label>
              <Input
                id="nama_kategori"
                name="nama_kategori"
                defaultValue={category.nama_kategori}
                required
                className="w-full h-10"
              />
               {/* Display Zod validation errors if available */}
               {state?.errors?.nama_kategori && (
                 <p className="flex items-center gap-1 text-sm text-destructive">
                   <CircleAlert className="w-3.5 h-3.5" />
                   {state.errors.nama_kategori[0]}
                 </p>
               )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="deskripsi"
                className="font-semibold"
              >
                Deskripsi (Opsional)
              </Label>
              <Textarea // Changed to Textarea
                id="deskripsi"
                name="deskripsi"
                defaultValue={category.deskripsi || ""}
                rows={4}
                className="w-full px-3 py-2 text-base border rounded-md shadow-sm border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
               {/* Display Zod validation errors if available */}
               {state?.errors?.deskripsi && (
                 <p className="flex items-center gap-1 text-sm text-destructive">
                   <CircleAlert className="w-3.5 h-3.5" />
                   {state.errors.deskripsi[0]}
                 </p>
               )}
            </div>
             {/* Thumbnail section removed */}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border bg-muted/10">
            <Button variant="outline" asChild className="w-full sm:w-auto">
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
  );
}