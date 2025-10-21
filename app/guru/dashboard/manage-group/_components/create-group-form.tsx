"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CreateGroup } from "../../../lib/actions"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, ImageIcon, UploadCloud, X, Loader2, CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { CardFooter } from "@/components/ui/card";

type FlattenedErrors = {
  group_name?: string[];
  group_thumbnail?: string[];
};

type GroupActionResult = {
  success?: string;
  error?: string;
  errors?: FlattenedErrors; 
  groupId?: string;
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[140px]">
      {pending ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Membuat Grup...
        </>
      ) : (
        "Buat Grup"
      )}
    </Button>
  );
}

export function CreateGroupForm() {
  const [state, formAction] = useActionState<GroupActionResult, FormData>(
    CreateGroup,
    {}
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.error || state.errors) {
       const description = state.error || "Periksa kembali isian form."; 
      toast.error("Gagal Membuat Grup", { description });
    }

    if (state.success) {
      toast.success("Berhasil!", { description: state.success });
      formRef.current?.reset();
      setImagePreview(null);
      setTimeout(() => {
        router.push("/guru/dashboard/manage-group");
        router.refresh();
      }, 1500);
    }
  }, [state, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (Maks. 2MB)");
        handleRemoveImage();
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung (JPG, PNG, WEBP).');
        handleRemoveImage();
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
        setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

   const getError = (path: keyof NonNullable<GroupActionResult['errors']>) => {
       return state.errors?.[path]?.[0];
   };

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="group_name">Nama Grup</Label>
        <Input
          id="group_name"
          name="group_name"
          placeholder="ex: Kelas 10 IPA 1"
          required
          aria-invalid={!!getError("group_name")}
          aria-describedby={getError("group_name") ? "group_name-error" : undefined}
        />
        {getError("group_name") && (
          <p id="group_name-error" className="flex items-center gap-1 text-sm text-destructive">
            <CircleAlert className="w-3.5 h-3.5" />
            {getError("group_name")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Thumbnail Grup (Opsional)
        </Label>
        <Label
          htmlFor="thumbnail"
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-border bg-muted/20"
        >
          {imagePreview ? (
            <div className="relative w-full h-full">
              <Image
                src={imagePreview}
                alt="Preview Thumbnail Grup"
                fill
                className="object-contain rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 z-10"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleRemoveImage(); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-center text-muted-foreground">
              <UploadCloud className="w-8 h-8 mb-1" />
              <p className="font-semibold text-sm">Klik untuk upload gambar</p>
              <p className="text-xs">JPG, PNG, WEBP (Maks. 2MB)</p>
            </div>
          )}
        </Label>
        <Input
          ref={fileInputRef}
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg"
          className="sr-only"
          onChange={handleImageChange}
          aria-invalid={!!getError("group_thumbnail")}
          aria-describedby={getError("group_thumbnail") ? "group_thumbnail-error" : undefined}
        />
        {getError("group_thumbnail") && (
          <p id="group_thumbnail-error" className="flex items-center gap-1 text-sm text-destructive">
            <CircleAlert className="w-3.5 h-3.5" />
            {getError("group_thumbnail")}
          </p>
        )}
         <p className="text-xs text-muted-foreground">
             Thumbnail akan menjadi ikon untuk grup Anda.
         </p>
      </div>

       <CardFooter className="flex justify-between pt-8 mt-4 border-t border-border px-0">
         <Button variant="outline" asChild>
           <Link href="/guru/dashboard/manage-group">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Batal
           </Link>
         </Button>
         <SubmitButton />
       </CardFooter>
    </form>
  );
}