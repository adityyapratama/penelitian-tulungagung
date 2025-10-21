"use client";

import { useState } from "react";
import Link from "next/link";
import { KategoriArtikel } from "@/lib/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeleteArticleCategory } from "../lib/actions";
import { Search, FilePenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog"; // ✅ pastikan file ini ada

type DataTableProps = {
  categories: KategoriArtikel[];
};

export function DataTable({ categories }: DataTableProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter(
    (category) =>
      category.nama_kategori.toLowerCase().includes(search.toLowerCase()) ||
      (category.deskripsi &&
        category.deskripsi.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kategori Artikel</CardTitle>
        <CardDescription>
          Berikut adalah daftar semua kategori yang tersedia.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative mb-4 w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama atau deskripsi..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.KategoriArtikel_id}>
                    <TableCell className="font-medium">
                      {category.nama_kategori}
                    </TableCell>
                    <TableCell>{category.deskripsi || "-"}</TableCell>
                    <TableCell>
                      {category.created_at
                        ? new Date(category.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link
                            href={`/admin/dashboard/manage-articles/categories/edit/${category.KategoriArtikel_id}`}
                          >
                            <FilePenLine className="h-4 w-4" />
                          </Link>
                        </Button>

                        {/* ✅ AlertDialog Konfirmasi Hapus */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Konfirmasi Hapus
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah kamu yakin ingin menghapus kategori{" "}
                                <strong>{category.nama_kategori}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  const result = await DeleteArticleCategory(
                                    category.KategoriArtikel_id
                                  );
                                  if (result.error) {
                                    toast.error(result.error);
                                  } else {
                                    toast.success(result.success);
                                  }
                                }}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Tidak ada hasil ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
