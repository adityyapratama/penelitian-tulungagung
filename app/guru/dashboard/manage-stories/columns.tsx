"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowUpDown, Settings } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { redirect } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { StoryColumn } from "./data-table";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getGuruColumns = (
  onDelete: (id: string) => void,
  deletingIds: Set<string>,
  basePath: string
): ColumnDef<StoryColumn>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Judul
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const story = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
            {story.thumbnail ? (
              <AvatarImage src={story.thumbnail} alt={story.judul} />
            ) : (
              <AvatarFallback>{story.judul.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{story.judul}</span>
            <span className="text-sm text-muted-foreground line-clamp-1">{story.deskripsi?.substring(0, 50)}...</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.KategoriCerita?.NamaKategori,
    id: "kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const categoryName = row.original.KategoriCerita?.NamaKategori;
      return <Badge variant="outline">{categoryName || "Tanpa Kategori"}</Badge>;
    },
  },
  {
    accessorKey: "xp_reward",
    header: "XP",
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-primary">
          {row.getValue("xp_reward")}
        </span>
      );
    },
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("is_published");
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date | null | undefined;
      if (!date) return "-";
      return (
        <span>{dayjs(date).tz("Asia/Jakarta").format("DD MMM YYYY")}</span>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const story = row.original;
      const id = story.cerita_id.toString();

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white"
            onClick={() => redirect(`${basePath}/configuration/${id}`)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white"
            onClick={() => redirect(`${basePath}/update/${id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2"
                disabled={deletingIds.has(id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                <AlertDialogDescription>
                  Data <span className="font-semibold">{story.judul}</span>{" "}
                  akan dihapus permanen dan tidak bisa dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];