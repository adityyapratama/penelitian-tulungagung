"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// Updated Path
import { DeleteQuizCategory } from "../lib/actions";
// Updated Path
import type { TCategoryColumn } from "./columns";

interface CellActionsProps {
  row: { original: TCategoryColumn };
}

export function CellActions({ row }: CellActionsProps) {
  const category = row.original;
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteQuizCategory(category.kategori_id.toString());
      if (result.success) {
        // Use message if available, otherwise default success
        toast.success(result.success ?? "Kategori berhasil dihapus.");
        setIsDialogOpen(false);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        <Button asChild variant="outline" size="icon" className="w-8 h-8">
          {/* Updated Link */}
          <Link
            href={`/guru/dashboard/manage-quiz/categories/edit/${category.kategori_id}`}
          >
            <Edit className="w-4 h-4" />
          </Link>
        </Button>

        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8"
          onClick={() => setIsDialogOpen(true)}
          disabled={isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus kategori{" "}
              <span className="font-semibold">{category.nama_kategori}</span>{" "}
              secara permanen. Kuis yang menggunakan kategori ini mungkin akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-700" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}