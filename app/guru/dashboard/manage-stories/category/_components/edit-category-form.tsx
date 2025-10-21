"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom"; 
import { updateCategory, type ActionResult } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { KategoriCerita } from "@/lib/generated/prisma";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Memperbarui..." : "Update Kategori"}
    </Button>
  );
}

export function UpdateCategoryForm({ category }: { category: KategoriCerita }) {
  const initialState: ActionResult = {};
  const updateActionWithId = updateCategory.bind(null, category.KategoriId.toString());
  const [state, formAction] = useActionState<ActionResult, FormData>(updateActionWithId, initialState);
  const router = useRouter();

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
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nama_kategori">Nama Kategori</Label>
        <Input
          id="nama_kategori"
          name="nama_kategori"
          defaultValue={category.NamaKategori}
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