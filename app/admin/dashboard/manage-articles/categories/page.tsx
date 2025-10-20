import Link from "next/link";
import { GetArticleCategory } from "../lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LibraryBig } from "lucide-react";
import { DataTable } from "./data-table";

export default async function CategoryListPage() {
  const categories = await GetArticleCategory();
  const totalCategories = categories.length;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manajemen Kategori Artikel
          </h1>
          <p className="text-muted-foreground">
            Kelola semua kategori untuk artikel di dalam sistem.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/manage-articles/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Link>
        </Button>
      </div>

      {/* Kartu Ringkasan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
          <LibraryBig className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCategories}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah semua kategori yang ada di dalam sistem.
          </p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable categories={categories} />
    </div>
  );
}
