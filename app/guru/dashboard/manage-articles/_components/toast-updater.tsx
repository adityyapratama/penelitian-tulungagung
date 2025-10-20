"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function ToastUpdater({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const error = searchParams.get("error");
  const currentPath = `/guru/dashboard/manage-articles/edit/${id}`; // Menggunakan ID yang diterima

  useEffect(() => {
    if (saved === "1") {
      toast.success("Artikel berhasil disimpan!");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("saved");
      router.replace(`${currentPath}?${newSearchParams.toString()}`, { scroll: false });
    } else if (error) {
      toast.error(`${decodeURIComponent(error)}`);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");
      router.replace(`${currentPath}?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router, currentPath, saved, error]);

  return null;
}