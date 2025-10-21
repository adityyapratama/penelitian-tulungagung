"use client";

import { useActionState} from "react";
import { useFormStatus } from "react-dom";
import { createCategory, type ActionResult } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Menyimpan..." : "Simpan Kategori"}
    </Button>
  );
}

export function CreateCategoryForm() {
  const initialState: ActionResult = {};
  const [state, formAction] = useActionState<ActionResult, FormData>(createCategory, initialState);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Berhasil", { description: state.success });
      router.push("/guru/dashboard/manage-stories/category");
    }
    if (state?.error) {
      toast.error("Gagal", { description: state.error });
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nama_kategori">Nama Kategori</Label>
        <Input
          id="nama_kategori"
          name="nama_kategori"
          placeholder="e.g. Sejarah, Petualangan"
          required
          className="max-w-md"
        />
        {state?.errors?.NamaKategori && (
          <p className="mt-1 text-sm font-medium text-red-500">
            {state.errors.NamaKategori[0]}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}