"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye, Image } from "lucide-react";
import Link from "next/link";
import { DeleteArticle } from "./lib/actions";

export type TArticleColumn = {
    artikel_id: number;
    judul: string;
    konten: string;
    kategori: number | null;
    thumbnail: string | null;
    created_by: number | null;
    created_at: Date;
    updated_at?: Date;
    KategoriArtikel?: { nama_kategori: string } | null;
    User?: { username: string } | null;
};

const handleDelete = async (articleId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.")) {
        const result = await DeleteArticle(articleId);
        if (result.error) {
            alert(`Gagal menghapus artikel: ${result.error}`);
        } else {
            alert(`Artikel berhasil dihapus.`);
            window.location.reload();
        }
    }
};

export const guruArticleColumns: ColumnDef<TArticleColumn>[] = [
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
        cell: ({ row }) => {
            const kategoriName = row.original.KategoriArtikel?.nama_kategori;
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    {kategoriName || "Tanpa Kategori"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const article = row.original;
            const basePath = "/guru/dashboard/manage-articles";

            return (
                <div className="flex items-center space-x-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent hover:bg-blue-500 hover:text-white"
                        title="Lihat Artikel"
                    >
                        <Link
                            href={`${basePath}/detail/${article.artikel_id}`}
                        >
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white"
                        title="Edit Artikel"
                    >
                        <Link
                            href={`${basePath}/edit/${article.artikel_id}`}
                        >
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 bg-transparent hover:bg-destructive hover:text-white"
                        title="Hapus Artikel"
                        onClick={() => handleDelete(article.artikel_id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];