"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye, Image } from "lucide-react";
import Link from "next/link";

export type TArticleColumn = {
  artikel_id: number;
  judul: string;
  konten: string;
  kategori: number | null;
  thumbnail: string | null;
  created_by: number | null;
  created_at: Date;
  updated_at?: Date;
};

const handleDelete = (articleId: number) => {
  if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
    console.log(`Menghapus artikel dengan ID: ${articleId}`);
    alert(`Artikel dengan ID ${articleId} telah dihapus (simulasi).`);
  }
};

export const articleColumns: ColumnDef<TArticleColumn>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string | null;
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "judul",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Judul Artikel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const judul = row.getValue("judul") as string;
      const konten = row.original.konten;
      return (
        <div className="space-y-1 max-w-xs">
          <p className="font-medium line-clamp-2">{judul}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {konten.replace(/<[^>]*>/g, "").substring(0, 50)}...
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "kategori",
    header: "Kategori",
    // ... (definisi header kategori tetap sama)
    cell: ({ row }) => {
      const kategori = row.getValue("kategori") as number | null;
      // Asumsi Anda akan memetakan ID kategori ke nama kategori di sini
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {kategori ? `Kategori ${kategori}` : "Tanpa Kategori"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const article = row.original;

      return (
        <div className="flex items-center space-x-2">
          {/* Tombol Lihat/Detail */}
          <Button
            asChild // <-- Gunakan asChild untuk meneruskan props ke Link
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-blue-500 hover:text-white"
            title="Lihat Artikel"
          >
            <Link
              href={`/admin/dashboard/manage-articles/detail/${article.artikel_id}`}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>

          {/* Tombol Edit */}
          <Button
            asChild // <-- Gunakan asChild
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white"
            title="Edit Artikel"
          >
            <Link
              href={`/admin/dashboard/manage-articles/edit/${article.artikel_id}`}
            >
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          {/* Tombol Hapus */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-destructive hover:text-white"
            title="Hapus Artikel"
            onClick={() => handleDelete(article.artikel_id)} // <-- Panggil fungsi handleDelete
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
