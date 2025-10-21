"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import type { KategoriCerita } from "@/lib/generated/prisma";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ActionsCell({ 
  row, 
  onDelete, 
  deletingIds 
}: { 
  row: Row<KategoriCerita>, 
  onDelete: (id: string) => void, 
  deletingIds: Set<string> 
}) {
  const router = useRouter(); 
  const category = row.original;
  const categoryId = category.KategoriId.toString();

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/guru/dashboard/manage-stories/category/edit/${categoryId}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={deletingIds.has(categoryId)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kategori <span className="font-semibold">{category.NamaKategori}</span> akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(categoryId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


export const getColumns = (
  onDelete: (id: string) => void,
  deletingIds: Set<string>
): ColumnDef<KategoriCerita>[] => [
  {
    accessorKey: "NamaKategori",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama Kategori
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.original.NamaKategori}</span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => (
      <ActionsCell 
        row={row} 
        onDelete={onDelete} 
        deletingIds={deletingIds} 
      />
    ),
  },
];