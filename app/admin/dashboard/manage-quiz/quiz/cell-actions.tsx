"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// 1. Impor ikon baru (misalnya ListPlus)
import { Edit, Trash2, ListPlus } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";



import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { DeleteQuiz } from "@/app/admin/dashboard/manage-quiz/lib/actions";
import type { TQuizColumn } from "./columns";

interface CellActionsProps {
  row: { original: TQuizColumn };
}

export function CellActions({ row }: CellActionsProps) {
  const quiz = row.original;
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteQuiz(quiz.kuis_id.toString());
      if (result.success) {
        toast.success("Kuis berhasil dihapus.");
        setIsDialogOpen(false);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end space-x-2">
        {/* 3. BARU: Tombol Tambah Soal */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="w-8 h-8">
              <Link href={`/admin/dashboard/manage-quiz/quiz/edit/${quiz.kuis_id}/question/create`}>
                <ListPlus className="w-4 h-4 text-sky-600" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambah Soal</p>
          </TooltipContent>
        </Tooltip>

        {/* Tombol Edit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="outline" size="icon" className="w-8 h-8">
              <Link href={`/admin/dashboard/manage-quiz/quiz/edit/${quiz.kuis_id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Kuis</p>
          </TooltipContent>
        </Tooltip>

        {/* Tombol Hapus */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8"
              onClick={() => setIsDialogOpen(true)}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Kuis</p>
          </TooltipContent>
        </Tooltip>
      </div>

     <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus kategori{" "}
              <span className="font-semibold">{quiz.judul}</span>{" "}
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
      </TooltipProvider>
  );
  }
  