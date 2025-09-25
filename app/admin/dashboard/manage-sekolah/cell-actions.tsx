"use client"

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
import { deleteSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/actions";
import type { TSekolahColumn } from "./columns";

interface CellActionsProps {
  row: { original: TSekolahColumn };
}

export function CellActions({ row }: CellActionsProps) {
  const sekolah = row.original;
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSekolah(sekolah.sekolah_id);
      if (result.success) {
        toast.success("Sekolah berhasil dihapus");
        setIsDialogOpen(false);
        router.refresh();
      } else if (result.error) {
        toast.error("Gagal menghapus sekolah");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        <Button asChild variant="outline" size="icon" className="w-8 h-8">
          <Link href={`/admin/dashboard/manage-sekolah/edit/${sekolah.sekolah_id}`}>
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
              Tindakan ini akan menghapus sekolah{" "}
              <span className="font-semibold">{sekolah.nama_sekolah}</span>{" "}
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
