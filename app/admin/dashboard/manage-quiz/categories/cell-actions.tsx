"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { DeleteQuizCategory } from "@/app/admin/dashboard/manage-quiz/lib/actions" // Sesuaikan path
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { TCategoryColumn } from "./columns" // Impor tipe

interface CellActionsProps {
  row: { original: TCategoryColumn }
}

export function CellActions({ row }: CellActionsProps) {
  const category = row.original;
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteQuizCategory(category.kategori_id.toString());
      if (result.success) {
        toast.success(result.success);
        setIsDialogOpen(false);
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        {/* Tombol Edit sudah benar */}
        <Button asChild variant="outline" size="icon" className="w-8 h-8">
          <Link href={`/admin/dashboard/manage-quiz/categories/edit/${category.kategori_id}`}>
            <Edit className="w-4 h-4" />
          </Link>
        </Button>
        {/* Tombol Hapus sekarang memicu dialog */}
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

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus kategori
              <span className="font-semibold"> {category.nama_kategori} </span>
              secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}